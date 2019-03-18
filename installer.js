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
                        if (!zErr)
                            resolve(`Server version ${version} downloaded and extracted.`);
                        else
                            reject(zErr);
                    });
                } else reject(rErr);
            });
        } else resolve(`Version ${version} already installed.`);
    });
};