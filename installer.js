const fs = require('fs');
const URL = require('url');
const path = require('path');
const AdmZip = require('adm-zip');
const request = require('request');

function downloadAndUnzip(url, destFolder) {
    if (typeof url === 'string')
        url = URL.parse(url);

    const ext = path.extname(url.pathname).substr(1);

    return new Promise((resolve, reject) => {

        if (ext === 'zip') {
            download(url)
                .then(buffer => {
                    unzip(buffer, destFolder)
                        .then(resolve())
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        } else reject(new Error('Only zip format supported'));

    });
}

function download(url) {
    if (typeof url === 'string')
        url = URL.parse(url);

    return new Promise((resolve, reject) => {

        console.log(`Downloading ${url.pathname}`);

        request({
            url,
            method: 'GET',
            encoding: null
        }, (err, resp, body) => {
            if (!err)
                resolve(body);
            else
                reject(err);
        });

    })
}

function unzip(buffer, folder) {
    return new Promise((resolve, reject) => {

        console.log(`Unzipping build to ${folder}`);

        const zip = new AdmZip(buffer);
        zip.extractAllToAsync(folder, true, err => {
            if (!err)
                resolve();
            else
                reject(err);
        });

    });
}

function unzipMod(buffer, folder, modname) {
    return new Promise((resolve, reject) => {

        console.log(`Unzipping module to ${folder}`);

        const zip = new AdmZip(buffer);
        const zipEntries = zip.getEntries();

        let mod;

        if (modname)
            mod = zipEntries.find(entry => entry.entryName === modname);

        if (!mod)
            mod = zipEntries.find(entry => path.extname(entry.entryName) === '.mod');

        if (mod) {

            if (zip.extractEntryTo(mod, folder, false, true)) {
                resolve(mod.entryName);
            } else reject(new Error('Failed unzipping mod'));

        } else reject(new Error('Not founded mod files'));

    });
}

function installServer(version) {
    const serverUrl = `https://nwnx.io/nwnee-dedicated-${version}.zip`;
    const buildPath = `./builds/${version}`;

    return new Promise((resolve, reject) => {

        if (!fs.existsSync(buildPath)) {

            console.log(`Installing build ${version}`);

            downloadAndUnzip(serverUrl, buildPath)
                .then(() => {

                    fs.chmod(buildPath + '/bin/linux-x86/nwserver-linux', 0o755, err => {
                        if (!err)
                            resolve(`Server version downloaded and extracted in ${buildPath}`);
                        else
                            reject(err);
                    });

                })
                .catch(err => reject(err));

        } else resolve(`Version ${version} already installed`);

    });
}

function installModule(config) {
    return new Promise((resolve, reject) => {
        const installDir = path.join(config.install_dir, 'modules');
        const modName = config.params.module;

        if (modName && fs.existsSync(path.join(installDir, modName + '.mod'))) {
            console.log(`Module ${modName} already installed`);
            return resolve(modName);
        }

        let url = URL.parse(config.module);

        if (url.host.includes('neverwintervault.org')) {
            const params = new URL.URLSearchParams(url.search);
            if (params.has('file'))
                url = URL.parse(params.get('file'));
        }

        const ext = path.extname(url.pathname).substr(1);

        console.log(`Installing module ${url.pathname}`);

        if (ext === 'zip' || ext === 'mod') {

            download(url)
                .then(buffer => {
                    if (ext === 'zip') {
                        unzipMod(buffer, installDir, modName)
                            .then(name => {
                                if (modName) {
                                    fs.rename(path.join(installDir, name), path.join(installDir, modName + '.mod'), err => {
                                        if (!err) {
                                            console.log(`Module ${modName} installed`);
                                            resolve(modName);
                                        } else reject(err);
                                    });
                                } else {
                                    name = name.replace('.mod', '');
                                    config.params.module = name;
                                    fs.writeFileSync('config.json', JSON.stringify(config));
                                    console.log(`config.json updated with module ${name}`);
                                    console.log(`Module ${name} installed`);
                                    resolve(name);
                                }
                            })
                            .catch(err => reject(err));
                    } else {
                        const name = modName ? modName + '.mod' : url.pathname.split('/').find(e => path.extname(e) === '.mod');

                        fs.writeFile(path.join(installDir, name), buffer, err => {
                            if (!err) {
                                name = name.replace('.mod', '');
                                if (!modName) {
                                    config.params.module = name;
                                    fs.writeFileSync('config.json', JSON.stringify(config));
                                    console.log(`config.json updated with module ${name}`);
                                }
                                console.log(`Module ${name} installed`);
                                resolve(name);
                            } else reject(err);
                        });
                    }
                })
                .catch(err => reject(err));

        } else reject(new Error(`${ext} files not supported`));
    });
}

module.exports = {
    server: installServer,
    module: installModule
}