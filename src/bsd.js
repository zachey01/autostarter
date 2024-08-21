"use strict";
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const rcPath = "/usr/local/etc/rc.d";

function enableAutostart(key, command, appPath, callback) {
  const scriptPath = path.join(rcPath, key);
  const scriptContent = `#!/bin/sh
#
# PROVIDE: ${key}
# REQUIRE: DAEMON
# KEYWORD: shutdown
#
# Add the following line to /etc/rc.conf to enable this service:
# ${key}_enable="YES"
#
. /etc/rc.subr

name="${key}"
rcvar="${key}_enable"

start_cmd="${command} &"
stop_cmd="killall ${path.basename(command)}"

load_rc_config $name
: \${${rcvar}:=NO}

run_rc_command "$1"
`;

  fs.writeFile(scriptPath, scriptContent, { mode: 0o755 }, (err) => {
    if (err) {
      callback(err);
    } else {
      exec(`sysrc ${key}_enable="YES"`, (error, stdout, stderr) => {
        if (error) {
          callback(new Error(stderr));
        } else {
          callback(null);
        }
      });
    }
  });
}

function disableAutostart(key, callback) {
  const scriptPath = path.join(rcPath, key);

  exec(`sysrc -x ${key}_enable`, (error, stdout, stderr) => {
    if (error) {
      callback(new Error(stderr));
    } else {
      fs.unlink(scriptPath, (err) => {
        if (err && err.code !== "ENOENT") {
          callback(err);
        } else {
          callback(null);
        }
      });
    }
  });
}

function isAutostartEnabled(key, callback) {
  exec(`sysrc -n ${key}_enable`, (error, stdout, stderr) => {
    if (error) {
      callback(new Error(stderr), false);
    } else {
      const isEnabled = stdout.trim() === "YES";
      callback(null, isEnabled);
    }
  });
}

module.exports = {
  enableAutostart,
  disableAutostart,
  isAutostartEnabled,
};
