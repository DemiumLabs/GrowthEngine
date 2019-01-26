'use strict';
const { exec } = require('child_process');

module.exports = {
  onMessage: function(message) {
    let data = JSON.parse(message.value);
    console.log(message);
    let cmd = `./bin/instabot-likers -i ${data.instance} -m ${data.media_id}`;
    console.log(cmd);
    exec(cmd, (err, stdout, stderr) => {
      console.log(`err: ${err}`);
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);

    });
  },
  onError: function(err) {
    console.log(err);
  },
  onOffsetOutOfRange: function(err) {
    console.log(err);
  },
};
