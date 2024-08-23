# `autostarter`

`autostarter` is a Node.js module that allows you to enable, disable, and check the autostart status of your applications. With `autostarter`, you can easily manage whether your application starts automatically on system boot.

![Static Badge](https://img.shields.io/badge/Zachey-autostarter-autostarter)
![GitHub top language](https://img.shields.io/github/languages/top/zachey01/autostarter)
![GitHub Repo stars](https://img.shields.io/github/stars/zachey01/autostarter)
![GitHub issues](https://img.shields.io/github/issues/zachey01/autostarter)
![NPM Downloads](https://img.shields.io/npm/dm/autostarter)

## Table of Contents

- [`autostarter`](#autostarter)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [npm](#npm)
    - [yarn](#yarn)
  - [Simple Usage](#simple-usage)
  - [API Documentation](#api-documentation)
    - [`enableAutostart(appName, command, path)`](#enableautostartappname-command-path)
    - [`disableAutostart(appName)`](#disableautostartappname)
    - [`isAutostartEnabled(appName)`](#isautostartenabledappname)
  - [Examples](#examples)
    - [Enable Autostart](#enable-autostart)
    - [Disable Autostart](#disable-autostart)
    - [Check Autostart Status](#check-autostart-status)
  - [Contributing](#contributing)

## Installation

You can install `autostarter` using either npm or yarn:

### npm

```shell
npm install autostarter
```

### yarn

```shell
yarn add autostarter
```

## Simple Usage

Here's a basic example demonstrating how to use the `autostarter` module:

```js
const autostarter = require("autostarter");

// Enable autostart for an application
enableAutostart("myApp", "node myApp.js", "/path/to/app")
  .then(() => console.log("Autostart enabled"))
  .catch((error) => console.error("Failed to enable autostart:", error));

// Disable autostart for an application
disableAutostart("myApp")
  .then(() => console.log("Autostart disabled"))
  .catch((error) => console.error("Failed to disable autostart:", error));

// Check if autostart is enabled
isAutostartEnabled("myApp")
  .then((isEnabled) => {
    if (isEnabled) {
      console.log("Autostart is enabled");
    } else {
      console.log("Autostart is not enabled");
    }
  })
  .catch((error) => console.error("Failed to check autostart:", error));
```

## API Documentation

### `enableAutostart(appName, command, path)`

Enables autostart for the specified application.

- **Parameters:**

  - `appName` (string): The name of the application to be enabled for autostart.
  - `command` (string): The command to run the application.
  - `path` (string): The path where the application is located.

- **Returns:** `Promise<void>`: Resolves when autostart is successfully enabled.

### `disableAutostart(appName)`

Disables autostart for the specified application.

- **Parameters:**

  - `appName` (string): The name of the application to be disabled for autostart.

- **Returns:** `Promise<void>`: Resolves when autostart is successfully disabled.

### `isAutostartEnabled(appName)`

Checks if autostart is enabled for the specified application.

- **Parameters:**

  - `appName` (string): The name of the application to check.

- **Returns:** `Promise<boolean>`: Resolves with `true` if autostart is enabled, `false` otherwise.

## Examples

### Enable Autostart

```js
const autostarter = require("autostarter");

autostarter
  .enableAutostart("myApp", "node myApp.js", "/path/to/app")
  .then(() => console.log("Autostart successfully enabled for myApp"))
  .catch((error) => console.error("Error enabling autostart:", error));
```

### Disable Autostart

```js
const autostarter = require("autostarter");

autostarter
  .disableAutostart("myApp")
  .then(() => console.log("Autostart successfully disabled for myApp"))
  .catch((error) => console.error("Error disabling autostart:", error));
```

### Check Autostart Status

```js
const autostarter = require("autostarter");

autostarter
  .isAutostartEnabled("myApp")
  .then((isEnabled) => {
    if (isEnabled) {
      console.log("Autostart is enabled for myApp");
    } else {
      console.log("Autostart is not enabled for myApp");
    }
  })
  .catch((error) => console.error("Error checking autostart status:", error));
```

## Contributing

Contributions are welcome! If you have any suggestions, improvements, or bug reports, please submit an issue or pull request on the [GitHub repository](https://github.com/zachey01/autostarter).
