# NWN:EE Dedicated Server for Node.js

### Install

i386 architecture and libs are required:
```bash
sudo dpkg --add-architecture i386
sudo apt install lib32stdc++6 libc6-i386
```

Download repository and install node_modules:
```bash
git clone https://github.com/hartontw/NWNEE_Server.git
cd NWNEE_Server
npm install
```

Create a ```config.json``` file in the root folder. If you want to override the server parameters located in ```nwnplayer.ini``` you can fill parameters object.

#### Example ```config.json``` file:
```json
{
    "version": "8186",
    "install_dir": "/home/YOUR_USER/.local/share/Neverwinter Nights/",
    "module": "https://neverwintervault.org/rolovault/projects/nwn1/modules/1570/Nordock.zip.zip",
    "params": {
        "servername": "NWN:EE Dedicated Server",
        "module": "ModuleName",
        "maxclients": 6,
        "publicserver": 0,
        "servervault": 1,
        "dmpassword": "password",
        "autosaveinterval": 1
    }
}
```

"module" entry accepts ```.zip``` or ```.mod``` files. 
If "params.module" is set, searchs in ```.zip``` file for any entry with the same name and extract it, if not is found, extracts the first file with ```.mod``` extension.
If "params.module" is not set, searchs for first file with ```.mod``` extension and save file name as module parameter.

Available versions: https://forums.beamdog.com/discussion/67157/server-download-packages-and-docker-support