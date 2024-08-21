"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");

function getUsername() {
  // Получаем имя пользователя через переменную окружения USERNAME
  return process.env.USERNAME || os.userInfo().username;
}

function fileExists(filePath) {
  try {
    // Проверяем, существует ли файл
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

function getWinStartupPath() {
  const releaseVersion = parseInt(os.release().split(".")[0], 10);

  if (releaseVersion >= 6) {
    // Для версий Windows с release >= 6
    const firstPart = path.join(
      "C:\\Users",
      getUsername(),
      "AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup"
    );
    return firstPart;
  }

  // Для старых версий Windows
  return path.join(
    "C:\\Documents and Settings",
    getUsername(),
    "Start Menu\\Programs\\Startup"
  );
}

function isAutostartEnabled(key, callback) {
  let err;

  if (process.env.FORCEERROR === "true") {
    err = new Error("Test error");
  } else {
    err = null;
  }

  const filePath = path.join(getWinStartupPath(), `${key}.bat`);
  callback(err, fileExists(filePath));
}

function enableAutostart(key, command, programPath, callback) {
  isAutostartEnabled(key, (error, isEnabled) => {
    if (error) {
      callback(error);
      return;
    }

    if (isEnabled) {
      callback("Autostart already is enabled");
      return;
    }

    const batchFileContent = `cd ${programPath} && ${command}`;
    const filePath = path.join(getWinStartupPath(), `${key}.bat`);

    fs.writeFile(filePath, batchFileContent, (err) => {
      callback(err);
    });
  });
}

function disableAutostart(key, callback) {
  isAutostartEnabled(key, (error, isEnabled) => {
    if (error) {
      callback(error);
      return;
    }

    if (!isEnabled) {
      callback("Autostart is not enabled");
      return;
    }

    const filePath = path.join(getWinStartupPath(), `${key}.bat`);

    fs.unlink(filePath, (err) => {
      callback(err);
    });
  });
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled,
};
