# autostarter

Its a Nodejs module for enabling autostart for your applications!

## Installation

```shell
npm install autostarter
```

or

```shell
yarn add autostarter
```

## Simple usage

```js
const autostarter = require("autostarter");

// Enable
enableAutostart("myApp", "node myApp.js", "/path/to/app")
  .then(() => console.log("Autostart enabled"))
  .catch((error) => console.error("Failed to enable autostart:", error));

// Disable
disableAutostart("myApp")
  .then(() => console.log("Autostart disabled"))
  .catch((error) => console.error("Failed to disable autostart:", error));

// Check
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
