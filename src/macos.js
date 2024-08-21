"use strict";
const fs = require("fs");
const path = require("path");
const os = require("os");

function getLaunchAgentsPath() {
  return path.join("/Users", os.userInfo().username, "Library/LaunchAgents");
}

function manageAutostart(action, key, command, programPath, callback) {
  const plistFileName = path.join(getLaunchAgentsPath(), `${key}.plist`);

  if (action === "enable") {
    const plistContent = `<?xml version="1.0" encoding="UTF-8"?>
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
    fs.writeFile(plistFileName, plistContent, callback);
  } else if (action === "disable") {
    fs.unlink(plistFileName, callback);
  }
}

function checkAutostart(key, callback) {
  callback(
    null,
    fs.existsSync(path.join(getLaunchAgentsPath(), `${key}.plist`))
  );
}

module.exports = {
  enableAutostart: (key, command, programPath, callback) =>
    manageAutostart("enable", key, command, programPath, callback),
  disableAutostart: (key, callback) =>
    manageAutostart("disable", key, null, null, callback),
  isAutostartEnabled: checkAutostart,
};
