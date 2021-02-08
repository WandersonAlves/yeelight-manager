# yeelight-manager

A service to super charge your yeelight use!

## Getting Started

Install `yeelight-manager` running `npm i -g yeelight-manager`, then, run `yee start` to start the server

Under your terminal, you'll see that `yeelight-manager` have found your bulbs. Remember that all your devices **must** be connected under the same network.

Exemple output:

```shell
12:38:39 info:main: Connecting to devices
12:38:39 info:Kitchen: Trying to connect into Kitchen in xxx.xxx.xx.x:55443
12:38:39 info:Corridor #1: Trying to connect into Corridor #1 in xxx.xxx.xx.x
12:38:39 info:Living Room: Trying to connect into Living Room in xxx.xxx.xx.x
12:38:39 info:Yeelight: Trying to connect into Yeelight in xxx.xxx.xx.x:55443
12:38:39 info:main: yeelight-manager-backend listening on 3000
12:38:39 info:Kitchen: Connected into Kitchen
12:38:39 info:Corridor #1: Connected into Corridor #1
12:38:39 info:Living Room: Connected into Living Room
12:38:39 info:Yeelight: Connected into Yeelight
```

After `yeelight-manager` start, you can run commands to control your lights, ex: `yee set <device-name-or-id> <cmd> <value> [bright]`

## Commands


1. `yee start` Start the server. Accepts `--verbose` or `--debug` to adjust the logging level
2. `yee set xxx bright <1-100>` Change the brightness of a device. Any value below 1 will be threated as 1 and above 100 will be threated as 100;
3. `yee set xxx ct|temperature|color_temperature <1700~6500> [bright]` Change the color temperature of a device. Any value below 1700 will be threated as 1700 and any value above 6500 will be threated as 6500;
4. `yee toggle xxx` Toggles a device
5. `yee set xxx power off|on` Explicity turn on or off a device. Usefful when creating scenes
6. `yee set xxx ambilight <ip>` (**beta**) Using Yeelight's Music Mode, scan for predominant color on screen and change on device. Uses `node-vibrant` and `ffmpeg` under the hood. Not tested on Windows and Mac OS
7. `yee set xxx color <hex-color> [bright]` Change the color of the device
8. `yee logs` See the logs
