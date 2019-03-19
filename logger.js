const fs = require('fs');
const path = require('path');

const logs = fs.existsSync('logs.json') ? JSON.parse(fs.readFileSync('logs.json')) : {};

module.exports = function(install_dir) {
    const logsPath = path.join(install_dir, '/logs.0/');
    setTimeout(fs.watch(logsPath, (event, filename) => {
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
    }), 5000);
};