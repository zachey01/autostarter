"use strict";
const fs = require("fs");
const os = require("os");
const path = require("path");

function getUsername() {
  // Получаем имя пользователя через переменную окружения USERNAME
  return process.env.USER || os.userInfo().username;
}

function fileExists(filePath) {
  try {
    // Проверяем, существует ли файл
    return fs.existsSync(filePath);
  } catch (err) {
    return false;
  }
}

function isAutostartEnabled(key, callback) {
  let err;

  if (process.env.FORCEERROR === "true") {
    err = new Error("Test error");
  } else {
    err = null;
  }

  const plistFileName = path.join(
    "/Users",
    getUsername(),
    "Library/LaunchAgents",
    `${key}.plist`
  );
  callback(err, fileExists(plistFileName));
}

function enableAutostart(key, command, programPath, callback) {
  isAutostartEnabled(key, (error, isEnabled) => {
    if (isEnabled) {
      callback("Autostart already is enabled");
      return;
    }

    // Создание .plist файла для запуска через launchd
    const plistFileContent = `<?xml version="1.0" encoding="UTF-8"?>
      <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
      <plist version="1.0">
        <dict>
          <key>Label</key><string>${key}</string>
          <key>ProgramArguments</key>
          <array>
            <string>bash</string>
            <string>-c</string>
            <string>cd ${programPath} && ${command}</string>
          </array>
          <key>RunAtLoad</key><true/>
        </dict>
      </plist>`;

    const plistFileName = path.join(
      "/Users",
      getUsername(),
      "Library/LaunchAgents",
      `${key}.plist`
    );

    fs.writeFile(plistFileName, plistFileContent, (err) => {
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

    // Удаление .plist файла
    const plistFileName = path.join(
      "/Users",
      getUsername(),
      "Library/LaunchAgents",
      `${key}.plist`
    );

    fs.unlink(plistFileName, (err) => {
      callback(err);
    });
  });
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled,
};
