# NWN:EE Dedicated Server for Node.js

You have to create a ```config.json``` file in the root folder. If you want to override the start parameters located in ```nwnplayer.ini``` you can fill parameters object.

#### Example ```config.json``` file:
```json
{
    "version": "8186",
    "params": {
        "-servername": "NWN:EE Dedicated Server",
        "-module": "ModuleName",
        "-maxclients": 6,
        "-publicserver": 0,
        "-servervault": 1,
        "-dmpassword": "password",
        "-autosaveinterval: 1,
    }
}
```