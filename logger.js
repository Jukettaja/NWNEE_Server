const fs = require('fs');

const logsPath = './logs/'; //Symblinked, if not /home/YOUR_USER/.local/share/Neverwinter Nights/logs.0/
const logs = JSON.parse(fs.readFileSync('logs.json'));

fs.watch(logsPath, (event, filename) => {
    if (filename) {
        const content = tracks[filename] || '';
        const file = fs.readFileSync(logsPath + filename).toString();
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