const fs = require('fs');
const path = require('path');

const logs = fs.existsSync('logs.json') ? JSON.parse(fs.readFileSync('logs.json')) : {};

async function watch(install_dir) {
    console.log("Watching log files...");

    const logsPath = path.join(install_dir, 'logs.0');

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
    while (!fs.existsSync(logsPath)) {
        await sleep(5000);
    }

    fs.watch(logsPath, (event, filename) => {

        if (filename) {

            const content = logs[filename] || '';

            const file = fs.readFileSync(path.join(logsPath, filename)).toString();

            const changes = file.replace(content, '').split('\n');
            changes.forEach(change => {
                if (filename.toLowerCase().includes('error'))
                    console.error(change);
                else
                    console.log(change);
            });

            logs[filename] = file;

            fs.writeFileSync('logs.json', JSON.stringify(logs));

        } else console.log(event);

    });
}

module.exports = watch;