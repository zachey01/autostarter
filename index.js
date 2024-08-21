"use strict";
let autostart;
switch (process.platform) {
  case "darwin":
    autostart = require("./src/macos.js");
    break;
  case "linux":
    autostart = require("./src/linux.js");
    break;
  case "win32":
    autostart = require("./src/windows.js");
    break;
  case "freebsd":
  case "openbsd":
  case "netbsd":
    autostart = require("./src/bsd.js");
    break;
  default:
    autostart = null;
}

function validateArguments(key, command, path) {
  if (typeof key !== "string") {
    throw new TypeError('"key" should be a string.');
  }
  if (command && typeof command !== "string") {
    throw new TypeError('"command" should be a string.');
  }
  if (path && typeof path !== "string") {
    throw new TypeError('"path" should be a string.');
  }
}

function enableAutostart(key, command, path, callback) {
  validateArguments(key, command, path);

  const execFunction = (resolve, reject) => {
    autostart.enableAutostart(key, command, path, (error) => {
      if (error) reject(error);
      else resolve();
    });
  };

  return callback ? execFunction(callback) : new Promise(execFunction);
}

function disableAutostart(key, callback) {
  validateArguments(key);

  const execFunction = (resolve, reject) => {
    autostart.disableAutostart(key, (error) => {
      if (error) reject(error);
      else resolve();
    });
  };

  return callback ? execFunction(callback) : new Promise(execFunction);
}

function isAutostartEnabled(key, callback) {
  validateArguments(key);

  const execFunction = (resolve, reject) => {
    autostart.isAutostartEnabled(key, (error, isEnabled) => {
      if (error) reject(error);
      else resolve(isEnabled);
    });
  };

  return callback ? execFunction(callback) : new Promise(execFunction);
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled,
};
