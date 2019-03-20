const fs = require('fs');
const exec = require('child_process').execFile;
const config = require('./config.json');
const installer = require('./installer');
const logger = require('./logger');

const execFile = './nwserver-linux';
const cwd = `./builds/${config.version}/bin/linux-x86/`;
const params = (mod) => {
    const prms = [];

    const keys = Object.keys(config.params);
    keys.forEach(key => {
        if (key !== 'module') {
            prms.push('-' + key.toLocaleLowerCase());
            prms.push(config.params[key]);
        }
    });

    if (mod) {
        prms.push('-module');
        prms.push(mod);
    }

    return prms;
}

async function firstInstall(timeOut, timeSpan) {
    try {
        console.log("This is a fresh install. Creating working directory...");
        const sleep = (ms) => new Promise(res => setTimeout(res, ms));
        const server = exec(execFile, [], { cwd });
        while (timeOut > 0 && !fs.existsSync(config.install_dir)) {
            timeOut -= timeSpan
            await sleep(timeSpan);
        }
        server.stdin.end();        

        if (timeOut <= 0)
            throw new Error('Something went wrong at first install. Try to run the server manually.');

        await sleep(1000);

    } catch (error) { throw error; }
}

installer.server(config.version)
    .then(async res => {
        try {
            console.log(res);

            if (!fs.existsSync(config.install_dir))
                await firstInstall(30000, 5000);            

            const modRes = config.module ? await installer.module(config) : config.params.module;

            console.log("Starting server...");
            const server = exec(execFile, params(modRes), { cwd });            

            server.stdout.on('data', data => console.log(data.toString()));
            server.stdout.on('error', err => console.error(err));
            server.stdout.on('close', () => console.log('Server closed.'));
            server.stdout.on('end', () => console.log('Server ended.'));

            server.stderr.on('data', data => console.error(data.toString()));

            logger(config.install_dir);

        } catch (error) {
            console.error(error);
        }
    })
    .catch(error => console.error(error));