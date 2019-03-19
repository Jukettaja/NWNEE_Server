const fs = require('fs');
const AdmZip = require('adm-zip');
const request = require('request');

module.exports = function(version) {
    const url = `https://nwnx.io/nwnee-dedicated-${version}.zip`
    const path = `./builds/${version}`;

    return new Promise((resolve, reject) => {
        if (!fs.existsSync(path)) {
            request({
                url: url,
                method: 'GET',
                encoding: null
            }, (rErr, resp, body) => {
                if (!rErr) {
                    const zip = new AdmZip(body);
                    zip.extractAllToAsync(path, true, zErr => {
                        if (!zErr) {
                            fs.chmod(path + '/bin/linux-x86/nwserver-linux', 0o755, cErr => {
                                if (!cErr)
                                    resolve(`Server version ${version} downloaded and extracted.`);
                                else
                                    reject(cErr);
                            });
                        } else reject(zErr);
                    });
                } else reject(rErr);
            });
        } else resolve(`Version ${version} already installed.`);
    });
};