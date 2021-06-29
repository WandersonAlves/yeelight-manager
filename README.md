# yeelight-manager

A CLI to super charge your yeelight use!

## Installation

`npm i -g yeelight-manager`

## Commands


1. `yee list` List all available devices. Uses SSDP method and port scanner method to retrieve devices.
2. `yee blink <name|id|ip>` Blink a device. Useful when you have multiple devices and wanna know with id/ip belongs to a device
3. `yee set <name|id|ip> name <name>` Sets a name for your device
4. `yee set <name|id|ip> bright <1-100>` Change the brightness of a device. Any value below 1 will be threated as 1 and above 100 will be threated as 100;
5. `yee set <name|id|ip> ct|temperature|color_temperature <1700~6500> [bright]` Change the color temperature of a device. Any value below 1700 will be threated as 1700 and any value above 6500 will be threated as 6500;
6. `yee set <name|id|ip> color <hex-color> [bright]` Change the color of the device;
7. `yee set <name|id|ip> power off|on` Explicity turn on or off a device;
8. `yee toggle <name|id|ip>` Toggles a device;
9. `yee ambilight <name|id|ip> <ip> <resolution> [interval]` (**beta**) Using Yeelight's Music Mode, scan for predominant color on screen and change on device. Uses `node-vibrant` and `ffmpeg` under the hood. Not tested on Windows and Mac OS.
