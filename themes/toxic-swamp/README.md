# Toxic Swamp

> Monero/Aeon Web Miner add-on module for After Dark.

## Screenshot

[![Screenshot of Toxic Swamp](https://jhabdas.keybase.pub/after-dark-v6.15.0-homepage-fs8.png "Toxic Swamp running on the After Dark homepage")](https://after-dark.habd.as)

## Features

- Mine cryptocurrency while visitors browse your sites
- Reward effort during site development and publishing
- Transparent, unobtrusive multilingual user interface
- Does not use cookies or connect to any third-parties
- Obfuscates end-user IPs and other connection details
- Automatically starts when external power is detected
- Suspends operation during loss of power or attention
- Optimized for low-bandwidth high-latency connections
- Cannot be detected by MinerBlock extension at 1.2.12

## Demo

View an [interactive demo](https://after-dark.habd.as) and [read the docs](https://after-dark.habd.as/module/toxic-swamp/).

## Setup

[Create Your Own Proxy](https://after-dark.habd.as/module/toxic-swamp/#create-your-own-proxy) if you would like to mine outside [The Fire Swamp](https://after-dark.habd.as/module/toxic-swamp/#the-fire-swamp).

## Installation

1. Choose a module download source:
    - https://www.npmjs.com/package/toxic-swamp
    - https://www.jsdelivr.com/package/npm/toxic-swamp
    - https://git.habd.as/comfusion/toxic-swamp

2. Extract module contents into site `themes` directory:

    ```sh
    ├── static
    └── themes
        ├── after-dark
        └── toxic-swamp
    ```

3. Specify module in site config:

    ```toml
    theme = [
      "toxic-swamp", # sequence before "after-dark"
      "after-dark"
    ]
    ```

4. Miner now functional. [Read the docs](https://after-dark.habd.as/module/toxic-swamp/) for help configuring.

For release verification and additional info see the [Toxic Swamp help docs](https://after-dark.habd.as/module/toxic-swamp/).

## Rights

Copyright (C) 2018, 2019 by Josh Habdas <jhabdas@protonmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

This copyright applies to the add-on module code and accompanying documentation and does not extend to the Webminer script itself. The text of the above license is included in the file COPYING in the source.
