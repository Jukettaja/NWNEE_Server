# NWN:EE Dedicated Server for Node.js

### Install

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
    "params": {
        "-servername": "NWN:EE Dedicated Server",
        "-module": "ModuleName",
        "-maxclients": 6,
        "-publicserver": 0,
        "-servervault": 1,
        "-dmpassword": "password",
        "-autosaveinterval": 1
    }
}
```

Available versions: https://forums.beamdog.com/discussion/67157/server-download-packages-and-docker-support