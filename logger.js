const fs = require('fs');
const path = require('path');

const logs = fs.existsSync('logs.json') ? JSON.parse(fs.readFileSync('logs.json')) : {};

async function watch(install_dir) {
    console.log("Watching log files...");

    while (!fs.existsSync(install_dir)) {
        const timer = ms => new Promise(res => setTimeout(res, ms));
        await timer(5000);
    }

    const logsPath = path.join(install_dir, '/logs.0/');

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