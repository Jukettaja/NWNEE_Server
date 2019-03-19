const exec = require('child_process').execFile;
const config = require('./config.json');
const installer = require('./installer');

installer(config.version)
    .then(msg => {
        console.log(msg);

        const cwd = `./builds/${config.version}/bin/linux-x86/`;
        const params = () => {
            const prms = [];

            const keys = Object.keys(config.params);
            keys.forEach(key => {
                prms.push(key);
                prms.push(config.params[key]);
            });

            return prms;
        }

        const server = exec('./nwserver-linux', params(), { cwd });
        server.stdout.on('data', data => console.log(data.toString()));
        server.stderr.on('data', data => console.error(data.toString()));

        require('./logger');
    })
    .catch(err => console.error(err));