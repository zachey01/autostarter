"use strict";
const { exec } = require("child_process");

function manageAutostart(action, key, command, programPath, callback) {
  const linuxCommand = `cd ${programPath} && ${command}`;
  const cronJob = `@reboot ${linuxCommand} # ${key}\n`;

  exec("crontab -l", (error, stdout) => {
    if (error && error.code !== 1) return callback(error);

    const cronJobs = stdout
      .split("\n")
      .filter((line) => !line.includes(`# ${key}`));

    if (action === "enable") {
      cronJobs.push(cronJob);
    }

    exec(`echo "${cronJobs.join("\n")}" | crontab -`, callback);
  });
}

function checkAutostart(key, callback) {
  exec("crontab -l", (error, stdout) => {
    callback(error, stdout.includes(`# ${key}`));
  });
}

module.exports = {
  enableAutostart: (key, command, programPath, callback) =>
    manageAutostart("enable", key, command, programPath, callback),
  disableAutostart: (key, callback) =>
    manageAutostart("disable", key, null, null, callback),
  isAutostartEnabled: checkAutostart,
};
