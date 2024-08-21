"use strict";

const platforms = {
  darwin: "./src/macos.js",
  linux: "./src/linux.js",
  win32: "./src/windows.js",
  freebsd: "./src/bsd.js",
  openbsd: "./src/bsd.js",
  netbsd: "./src/bsd.js",
};

const autostart = platforms[process.platform]
  ? require(platforms[process.platform])
  : null;

function validateArguments(key, command, programPath) {
  if (typeof key !== "string") throw new TypeError('"key" should be a string.');
  if (command && typeof command !== "string")
    throw new TypeError('"command" should be a string.');
  if (programPath && typeof programPath !== "string")
    throw new TypeError('"programPath" should be a string.');
}

function handleCallbackOrPromise(execFunction, callback) {
  return callback ? execFunction(callback) : new Promise(execFunction);
}

function enableAutostart(key, command, programPath, callback) {
  validateArguments(key, command, programPath);
  return handleCallbackOrPromise(
    (cb) => autostart.enableAutostart(key, command, programPath, cb),
    callback
  );
}

function disableAutostart(key, callback) {
  validateArguments(key);
  return handleCallbackOrPromise(
    (cb) => autostart.disableAutostart(key, cb),
    callback
  );
}

function isAutostartEnabled(key, callback) {
  validateArguments(key);
  return handleCallbackOrPromise(
    (cb) => autostart.isAutostartEnabled(key, cb),
    callback
  );
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled,
};
