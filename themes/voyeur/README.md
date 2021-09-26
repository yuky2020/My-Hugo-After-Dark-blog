# Voyeur

> Self-hosted analytics for [After Dark]. Voyeur adds support for [Fathom Analytics](https://usefathom.com).

[![Latest NPM version](https://img.shields.io/npm/v/mod-voyeur.svg?style=flat-square)](https://www.npmjs.com/package/mod-voyeur)
[![NPM downloads per month](https://img.shields.io/npm/dm/mod-voyeur.svg?style=flat-square)](https://www.npmjs.com/package/mod-voyeur)
[![Minimum After Dark version](https://img.shields.io/badge/dynamic/json.svg?url=https://git.habd.as/comfusion/voyeur/raw/branch/master/package.json&label=after%20dark&query=$..['after-dark']&colorB=000000&style=flat-square&longCache=false&maxAge=86400)](https://git.habd.as/comfusion/after-dark/)
[![0BSD licensed](https://img.shields.io/npm/l/mod-voyeur.svg?style=flat-square&longCache=true)](https://git.habd.as/comfusion/voyeur/src/branch/master/COPYING)

## Requirements

- Domain Name. Pick one up on [AWS Route 53](https://aws.amazon.com/route53/) starting at $12/year.
- Virtual Private Server. Get one with [Vultr](https://www.vultr.com/), [DigitalOcean](https://www.digitalocean.com/) or [AWS Lightsail](https://aws.amazon.com/lightsail/).

## Setup

For Voyeur to operate you must have [Fathom](https://github.com/usefathom/fathom/) up and running on a VPS or embedded device such as ODROID or Raspberry Pi. If your domain uses <abbr title="Transport Layer Security">TLS</abbr> you must also enable TLS on your Fathom domain for reporting to function. If you have a wildcard SSL cert on your existing domain consider hosting Fathom on a subdomain such as `stats.example.com` for certificate reuse.

An example [Docker Compose](https://docs.docker.com/compose/) file to run Fathom using a Postgres database has been provided to you here as a convenience. Instructions on using it are beyond the scope of this module.

## Installation

1. Copy the contents of this repository into a directory called `themes/voyeur` under the root your After Dark site.
2. Add `voyeur` as a [theme component](https://gohugo.io/themes/theme-components/) to your After Dark site `config.toml`, e.g.

    ```toml
    theme = [
      "voyeur", # sequence before "after-dark"
      "after-dark"
    ]
    ```

3. Add and specify settings for the module in your After Dark site config, e.g.

    ```toml
    [params.modules.voyeur]
      enabled = true # Optional, set false to disable module
      url = "https://stats.example.org" # Optional, base analytics URL
      port = "8080" # Optional, port setting
    ```

4. Build and deploy your After Dark site.

For additional information please see the [Fathom project](https://github.com/usefathom/fathom/).

## Development

For development, install Docker on your machine:

- [Get started with Docker for Mac](https://docs.docker.com/docker-for-mac/)
- [Get started with Docker for Windows](https://docs.docker.com/docker-for-windows/)

Configure your environment to use the dev [config override](https://docs.docker.com/compose/extends/):

```
export COMPOSE_FILE=docker-compose.yml:docker-compose.dev.yml
```

Run `docker-compose up` to start the app.

## Contributing

Please squash commits and use [Convention Commit](https://www.conventionalcommits.org/) messages. Run `npm run commit` after installing NPM dev dependencies for help creating conventional commit messages.

## Rights

Copyright (C) 2018, 2019 by Josh Habdas <jhabdas@protonmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.

The text of the above license is included in the file COPYING in the source.

[After Dark]: https://git.habd.as/comfusion/after-dark/
