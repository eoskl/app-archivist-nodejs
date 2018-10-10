[logo]: https://www.xy.company/img/home/logo_xy.png

![logo]

# ARCHIVIST SDK (sdk-archivist-nodejs)

An archivist to run on the XYO network

## Branches

### Master

[![CircleCI](https://circleci.com/gh/XYOracleNetwork/sdk-archivist-nodejs/tree/master.svg?style=svg&circle-token=bacbe80a579adde22b3fb593d41b0fc0556f2f3d)](https://circleci.com/gh/XYOracleNetwork/sdk-archivist-nodejs/tree/master)
[![BCH compliance](https://bettercodehub.com/edge/badge/XYOracleNetwork/sdk-archivist-nodejs?branch=master)](https://bettercodehub.com/results/XYOracleNetwork/sdk-archivist-nodejs)
[![Build Status](https://travis-ci.com/XYOracleNetwork/sdk-archivist-nodejs.svg?branch=master)](https://travis-ci.com/XYOracleNetwork/sdk-archivist-nodejs)

### Develop

Needs to be Added

## Getting started

```sh
# install globally
npm install -g @xyo-network/sdk-archivist-nodejs
```

This will expose a cli named `xyo-archivist` to launch the archivist.

```sh
# Start archivist
xyo-archivist -p 9050 -g 10050 -d ~/some-data-folder
```

### CLI options

- `-p` or `--port` The TCP port the archivist tcp server will bind to
- `-g` or `--graphql` The http port to listen on for graphql connections
- `-d` or `--data` The directory of the data folder to persist archivist data

## Developer Guide

### Install dependencies

This project uses `yarn` as a package manager

```sh
  # install dependencies
  yarn install
```

Developers should conform to git flow workflow. Additionally, we should try to make sure
every commit builds. Commit messages should be meaningful serve as a meta history for the
repository. Please squash meaningless commits before submitting a pull-request.

There is git hook on commits to validate the project builds. If you'd like to commit your changes
while developing locally and want to skip this step you can use the `--no-verify` commit option.

i.e.

```sh
  git commit --no-verify -m "COMMIT MSG"
```

## License

Only for internal XY Company use at this time

## Credits

Made with ❤️
by [XYO](https://xyo.network)