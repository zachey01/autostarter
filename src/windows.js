"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");

function getWinStartupPath() {
  const baseDir =
    parseInt(os.release().split(".")[0], 10) >= 6
      ? "C:\\Users"
      : "C:\\Documents and Settings";

  return path.join(
    baseDir,
    os.userInfo().username,
    "AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup"
  );
}

function manageAutostart(action, key, command, programPath, callback) {
  const filePath = path.join(getWinStartupPath(), `${key}.bat`);

  if (action === "enable") {
    fs.writeFile(filePath, `cd ${programPath} && ${command}`, callback);
  } else if (action === "disable") {
    fs.unlink(filePath, callback);
  }
}

function checkAutostart(key, callback) {
  callback(null, fs.existsSync(path.join(getWinStartupPath(), `${key}.bat`)));
}

module.exports = {
  enableAutostart: (key, command, programPath, callback) =>
    manageAutostart("enable", key, command, programPath, callback),
  disableAutostart: (key, callback) =>
    manageAutostart("disable", key, null, null, callback),
  isAutostartEnabled: checkAutostart,
};
