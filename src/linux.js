"use strict";
const { exec } = require("child_process");

function isAutostartEnabled(key, callback) {
  exec("crontab -l", (error, stdout) => {
    if (process.env.FORCEERROR === "true") {
      error = new Error("Test Error");
    }

    if (error && error.code !== 1) {
      callback(error, null);
      return;
    }

    const isEnabled = stdout.includes(`# ${key}`);
    callback(null, isEnabled);
  });
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

    const linuxCommand = `cd ${programPath} && ${command}`;
    const cronJob = `@reboot ${linuxCommand} # ${key}\n`;

    exec(`(crontab -l; echo "${cronJob}") | crontab -`, (err) => {
      callback(err);
    });
  });
}

function disableAutostart(key, callback) {
  exec("crontab -l", (error, stdout) => {
    if (error) {
      callback(error);
      return;
    }

    const cronJobs = stdout
      .split("\n")
      .filter((line) => !line.includes(`# ${key}`))
      .join("\n");

    exec(`echo "${cronJobs}" | crontab -`, (err) => {
      callback(err);
    });
  });
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled,
};
