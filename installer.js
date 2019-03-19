const fs = require('fs');
const AdmZip = require('adm-zip');
const request = require('request');

module.exports = function(version) {
    const url = `https://nwnx.io/nwnee-dedicated-${version}.zip`
    const path = `./builds/${version}`;

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) {
            console.log(`${version} Downloading...`)
            request({
                url: url,
                method: 'GET',
                encoding: null
            }, (rErr, resp, body) => {
                if (!rErr) {
                    const zip = new AdmZip(body);
                    console.log(`${version} Unzipping...`)
                    zip.extractAllToAsync(path, true, zErr => {
                        if (!zErr) {
                            fs.chmod(path + '/bin/linux-x86/nwserver-linux', 0o755, cErr => {
                                if (!cErr)
                                    resolve({ msg: `Server version downloaded and extracted in ${path}`, installed: true });
                                else
                                    reject(cErr);
                            });
                        } else reject(zErr);
                    });
                } else reject(rErr);
            });
        } else resolve({ msg: `Version ${version} already installed.` });
    });
};