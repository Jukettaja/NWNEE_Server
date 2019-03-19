const exec = require('child_process').execFile;
const config = require('./config.json');
const installer = require('./installer');
const logger = require('./logger');

const execFile = './nwserver-linux';
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

installer(config.version)
    .then(res => {
        console.log(res.msg);

        const server = exec(execFile, params(), { cwd });

        server.stdout.on('data', data => console.log(data.toString()));
        server.stdout.on('error', err => console.error(err));
        server.stdout.on('close', () => console.log('Server closed.'));
        server.stdout.on('end', () => console.log('Server ended.'));

        server.stderr.on('data', data => console.error(data.toString()));

        logger(config.install_dir);
    })
    .catch(err => console.error(err));