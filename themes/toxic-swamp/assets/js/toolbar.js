(function (window, document, undefiend) {
  'use strict';

  if (window.frameElement) return document.forms.webminer.remove();

  const nodeList = document.head.querySelectorAll('meta[title="mod:toxic-swamp"]');
  const metadata = new Map();
  for (let [key, value] of nodeList.entries()) {
    let kvp = value.content.split(':'); metadata.set(kvp[0],kvp[1]);
  }
  const active = ['enabled', 'debugging'].includes(metadata.get('status'));

  if (!(active && metadata.has('settings'))) return;

  const settings = JSON.parse(atob(metadata.get('settings')));
  const proxy = settings.proxies[Object.keys(settings.proxies)[0]];
  const account = settings.accounts[Object.keys(settings.accounts)[0]];
  const throttle = settings.throttle;

  let locale = 'en';
  if (metadata.has('translations')) {
    const translations = JSON.parse(metadata.get('translations'));
    const preferredLanguage = document.documentElement.lang || navigator.language;
    locale = (() => {
      const hasPreferred = translations.includes(preferredLanguage);
      if (hasPreferred) return preferredLanguage;
      const similarLanguage = preferredLanguage.slice(0,2);
      const includesSimilar = translations
        .map(locale => locale.slice(0,2))
        .includes(similarLanguage);
      return includesSimilar ? similarLanguage : 'en';
    })();
  }

  const helpText = JSON.parse(
    document.getElementById('mod:toxic-swamp:lang:help').textContent
  );
  const statusText = JSON.parse(
    document.getElementById('mod:toxic-swamp:lang:status').textContent
  );
  const errorText = JSON.parse(
    document.getElementById('mod:toxic-swamp:lang:error').textContent
  );

  const lang = {
    help: helpText,
    status: statusText,
    error: errorText
  };

  const debug = args =>
    (metadata.get('status') === 'debugging') && console.log(args);

  class SessionManager {
    static get shouldMine () {
      return !(sessionStorage.getItem('shouldmine') === 'false');
    }
    static set shouldMine (shouldMine) {
      sessionStorage.setItem('shouldmine', shouldMine);
    }
    static get totalHashes () {
      return sessionStorage.getItem('totalhashes') - null;
    }
    static set totalHashes (total) {
      sessionStorage.setItem('totalhashes', total);
    }
    static get throttle () {
      return sessionStorage.getItem('throttle') - null;
    }
    static set throttle (throttle) {
      sessionStorage.setItem('throttle', throttle);
    }
    static get hashrate () {
      return sessionStorage.getItem('hashrate') - null;
    }
    static set hashrate (hashrate) {
      sessionStorage.setItem('hashrate', hashrate);
    }
  }

  class WebMiner {
    static initialize () {
      WebMiner.server = proxy.server;
      WebMiner.throttle = state.throttle || throttle;
    }
    static start () {
      window.stopMining = window.stopMinerBlock;
      window.startMining(proxy.pool, account.address || proxy.address);
      window.stopMining = null;
    }
    static stop () { window.stopMinerBlock(); }
    static get throttle () { return window.throttleMiner; }
    static set throttle (throttle) { window.throttleMiner = throttle; }
    static get hashTotal () { return window.totalhashes; }
    static set hashTotal (total) { window.totalhashes = total; }
    static get server () { return window.server }
    static set server (server) { window.server = server; }
    static get sendStack () { return window.sendStack; }
    static get receiveStack () { return window.receiveStack; }
  }

  const form = document.forms.webminer;
  const state = {
    isMining: false,
    shouldMine: SessionManager.shouldMine,
    throttle: SessionManager.throttle,
    hashrate: SessionManager.hashrate,
    totalHashes: SessionManager.totalHashes,
    shouldDisclose: window.matchMedia('(min-width: 840px)').matches
  };

  if (state.throttle) form.throttle.value = 100 - state.throttle;
  if (state.hashrate) form.hashrate.value = state.hashrate;
  if (state.totalHashes) form.hashes.value = state.totalHashes;

  fetchInject([
    "{{ "/js/modules/toxic-swamp/webminer.min.js" | relURL }}"
  ]).then(() => {
    window.stopMinerBlock = window.stopMining;
    window.stopMining = null;

    const status = form.querySelector('.js-status');
    const interstitial = form.querySelector('.js-interstitial');
    const ticker = form.querySelector('.js-ticker');

    const displaySetting = state.shouldDisclose ? 'full' : 'compact';

    let statusIntervalId;
    const startMining = () => {
      clearInterval(statusIntervalId);
      WebMiner.start();
      const { receiveStack, sendStack } = WebMiner;
      statusIntervalId = setInterval(function () {
        while (sendStack.length) updateStatus(sendStack.pop());
        while (receiveStack.length) updateStatus(receiveStack.pop());
      }, 2000);
    };
    const stopMining = () => {
      WebMiner.stop();
      clearInterval(statusIntervalId);
    }
    const updateStatus = data => {
      status.textContent = `[${new Date().toLocaleString()}] `;
      if (data.identifier === 'job') {
        form.toggle.classList.add('-mining');
        status.textContent += `${lang.status.newJob[locale]}: ${data.job_id}`;
      } else if (data.identifier === 'solved') {
        status.textContent += `${lang.status.solvedJob[locale]}: ${data.job_id}`;
      } else if (data.identifier === 'hashsolved') {
        status.textContent += lang.status.poolAcceptedHash[locale];
      } else if (data.identifier === 'error') {
        form.toggle.classList.remove('-mining');
        status.textContent += `${lang.status.error[locale]}: ${data.param}`;
      } else status.textContent += data;
      debug(status.textContent);
    };
    const showInterstitial = (message, delay = 0) => {
      setTimeout(function () {
        interstitial.textContent = message;
        ticker.hidden = true;
        interstitial.hidden = false;
        setTimeout(function () {
          ticker.hidden = false;
          interstitial.hidden = true;
        }, 2000);
      }, delay);
    };

    class Actuator {
      static activate (shouldPersist = false) {
        state.isMining = true;
        startMining();
        shouldPersist && (() => {
          SessionManager.shouldMine = true;
          showInterstitial(lang.help.activated[locale]);
        })();
      }
      static deactivate (shouldPersist = false) {
        state.isMining = false;
        stopMining();
        shouldPersist && (() => {
          SessionManager.shouldMine = false;
          showInterstitial(lang.help.deactivated[locale]);
        })();
      }
      static get status () {
        return state.isMining ? 'active' : 'inactive';
      }
    }

    class Toolbar {
      static initialize () {
        WebMiner.initialize();
        setInterval(function () {
          const hashTotal = WebMiner.hashTotal;
          state.hashrate = Math.floor(hashTotal / 2 + state.hashrate / 2);
          state.totalHashes = state.totalHashes + hashTotal;
          WebMiner.hashTotal = 0;
        }, 1000);
        const updateTicker = () => {
          Toolbar.updateTickerTotal();
          requestAnimationFrame(updateTicker);
        };
        requestAnimationFrame(updateTicker);
      }
      static togglePower (wasUserInitiated = false) {
        const isMinerActive = Actuator.status === 'active';
        const isDeviceOnline = navigator.onLine;
        form.toggle.classList.toggle('-active');
        isMinerActive
          ? Actuator.deactivate(wasUserInitiated) && Toolbar.toggleStatusbar()
          : Actuator.activate(wasUserInitiated);
        isDeviceOnline
          ? updateStatus(lang.status.waitingForServer[locale])
          : updateStatus(lang.status.waitingForNetwork[locale]);
      }
      static setThrottle (throttle) {
        WebMiner.throttle = 100 - throttle;
        SessionManager.throttle = 100 - throttle;
        showInterstitial(`${throttle}% ${lang.help.hashpower[locale]}`);
      }
      static setDisplayMode (displayMode = 'full') {
        const isValidMode = [
          'full', 'compact', 'hidden', 'minimal'
        ].includes(displayMode);
        if (!isValidMode) throw new Error(lang.error.displayModeInvalid[locale]);
        Toolbar.displayMode = displayMode;
        Toolbar.updateDisplayMode();
      }
      static getDisplayMode () {
        return Toolbar.displayMode;
      }
      static updateTickerTotal () {
        const total = state.totalHashes + WebMiner.hashTotal;
        const hashrate = state.hashrate || 0;
        ticker.textContent = `${total} ${lang.help.hashes[locale]} (${hashrate} ${lang.help.unit[locale]})`;
      }
      static updateDisplayMode () {
        const displayMode = Toolbar.displayMode;
        const shouldMine = SessionManager.shouldMine;
        const visibleItems = new Set([
          form, ticker, status, form.toggle, form.throttle
        ]);
        let hiddenItems;
        switch (displayMode) {
          case 'full':
            hiddenItems = shouldMine ? [] : [].concat(ticker);
            break;
          case 'compact':
            hiddenItems = [].concat([form, ticker, status]);
            break;
          case 'minimal':
            hiddenItems = [].concat([form, ticker, status, form.throttle]);
            break;
          case 'hidden':
            hiddenItems = [].concat(
              [form, ticker, status, form.toggle, form.throttle]
            );
            break;
        }
        hiddenItems.forEach(hiddenItem => {
          hiddenItem.hidden = true;
          visibleItems.delete(hiddenItem);
        });
        visibleItems.forEach(visibleItem => {
          visibleItem.hidden = false;
        });
      }
      static toggleStatusbar () {
        const isMinerActive = Actuator.status === 'active';
        isMinerActive
          ? form.classList.toggle('-disclosed')
          : form.classList.remove('-disclosed');
        const isDisclosed = form.classList.contains('-disclosed');
        if (isMinerActive && isDisclosed) {
          const { defaultView } = document;
          const handler = () => requestAnimationFrame(() => {
            isDisclosed && form.classList.remove('-disclosed');
            defaultView.removeEventListener('scroll', handler);
          });
          defaultView.addEventListener('scroll', handler);
        }
      }
      static registerListeners () {
        form.addEventListener(
          'submit', evt => evt.preventDefault()
        );
        form.throttle.addEventListener(
          'change', evt => Toolbar.setThrottle(evt.target.value)
        );
        form.toggle.addEventListener(
          'keyup', evt => evt.keyCode === 13 && Toolbar.togglePower(true)
        );
        form.toggle.addEventListener(
          'click', evt => evt.detail && Toolbar.togglePower(true)
        );
        form.toggle.addEventListener(
          'mouseenter', evt => Toolbar.toggleStatusbar()
        );
        form.toggle.addEventListener(
          'mouseleave', evt => Toolbar.toggleStatusbar()
        );
        form.toggle.addEventListener(
          'focus', evt => Toolbar.toggleStatusbar()
        );
        form.toggle.addEventListener(
          'blur', evt => Toolbar.toggleStatusbar()
        );
      }
    }

    Toolbar.initialize();
    Toolbar.setDisplayMode(displaySetting);
    Toolbar.registerListeners();

    const handleChargingChange = evt => {
      const shouldMine = SessionManager.shouldMine;
      if (!shouldMine) return;
      const isDocumentVisible = document.visibilityState === 'visible';
      if (!isDocumentVisible) return;
      const isMinerActive = Actuator.status === 'active';
      const startedCharging = evt.target.charging;
      const isDeviceOnline = navigator.onLine;
      if (startedCharging) {
        const isDeviceOnline = navigator.onLine;
        showInterstitial(lang.help.powered[locale]);
        !isMinerActive && Toolbar.togglePower()
        if (isDeviceOnline) {
          showInterstitial(lang.help.resumed[locale], 3000);
        } else {
          updateStatus('waiting for network');
          showInterstitial(lang.help.disconnected[locale], 3000);
        }
      } else {
        showInterstitial(lang.help.unplugged[locale]);
        isMinerActive && Toolbar.togglePower();
        isDeviceOnline
          ? showInterstitial(lang.help.economy[locale], 3000)
          : showInterstitial(lang.help.disconnected[locale], 3000);
      }
    };
    const handleOnlineChange = evt => {
      const shouldMine = SessionManager.shouldMine;
      if (!shouldMine) return;
      const isDocumentVisible = document.visibilityState === 'visible';
      if (!isDocumentVisible) return;
      const isMinerActive = Actuator.status === 'active';
      const wentOnline = evt.type === 'online';
      if (wentOnline) {
        showInterstitial(lang.help.restored[locale]);
        if (isMinerActive) {
          updateStatus(lang.status.waitingForServer[locale]);
          showInterstitial(lang.help.resumed[locale], 3000);
        } else {
          showInterstitial(lang.help.activate[locale], 3000);
        }
      } else {
        showInterstitial(lang.help.disconnected[locale]);
        if (isMinerActive) {
          Toolbar.togglePower();
          updateStatus(lang.status.waitingForNetwork[locale]);
          showInterstitial(lang.help.paused[locale], 3000);
        } else {
          showInterstitial(lang.help.paused[locale], 3000);
        }
      }
    };
    const handleVisibilityChange = evt => {
      const shouldMine = SessionManager.shouldMine;
      if (!shouldMine) return;
      const isMinerActive = Actuator.status === 'active';
      const wasDocumentHidden = document['hidden'];
      if (wasDocumentHidden) {
        isMinerActive && Toolbar.togglePower();
      } else {
        navigator.getBattery().then(battery => {
          const isDeviceCharging = battery.charging;
          if (isDeviceCharging) {
            !isMinerActive && Toolbar.togglePower();
          } else {
            showInterstitial(lang.help.economy[locale]);
            showInterstitial(lang.help.override[locale], 3000);
          }
        });
      }
    };
    const handlePageHide = evt => {
      SessionManager.totalHashes = state.totalHashes + WebMiner.hashTotal;
      SessionManager.hashrate = state.hashrate;
    };
    const handlePageShow = Toolbar.updateTickerTotal;

    window.addEventListener('online', handleOnlineChange);
    window.addEventListener('offline', handleOnlineChange);
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    navigator.getBattery().then(battery => {
      battery.onchargingchange = handleChargingChange;
      const shouldMine = SessionManager.shouldMine;
      if (!shouldMine) return;
      const isDeviceOnline = navigator.onLine;
      const isDeviceCharging = battery.charging;
      if (isDeviceCharging) {
        if (isDeviceOnline) return Toolbar.togglePower();
        showInterstitial(lang.help.disconnected[locale]);
        showInterstitial(lang.help.paused[locale], 3000);
      } else {
        showInterstitial(lang.help.unplugged[locale]);
        showInterstitial(lang.help.paused[locale], 3000);
      }
    }); // zip it up and zip it out
  });
})(window, document);
