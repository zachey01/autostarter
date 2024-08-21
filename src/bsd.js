"use strict";
const fs = require("fs");
const path = require("path");
const exec = require("child_process").exec;

const rcPath = "/usr/local/etc/rc.d";

function manageAutostart(action, key, command, appPath, callback) {
  const scriptPath = path.join(rcPath, key);

  if (action === "enable") {
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
      if (err) return callback(err);
      exec(`sysrc ${key}_enable="YES"`, callback);
    });
  } else if (action === "disable") {
    exec(`sysrc -x ${key}_enable`, (err) => {
      if (err) return callback(err);
      fs.unlink(scriptPath, (fsErr) =>
        callback(fsErr && fsErr.code !== "ENOENT" ? fsErr : null)
      );
    });
  }
}

function checkAutostart(key, callback) {
  exec(`sysrc -n ${key}_enable`, (error, stdout) => {
    callback(error, stdout.trim() === "YES");
  });
}

module.exports = {
  enableAutostart: (key, command, appPath, callback) =>
    manageAutostart("enable", key, command, appPath, callback),
  disableAutostart: (key, callback) =>
    manageAutostart("disable", key, null, null, callback),
  isAutostartEnabled: checkAutostart,
};
