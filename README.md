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
9. `yee ambilight <name|id|ip> <resolution> [interval]` (**beta**) Using Yeelight's Music Mode, scan for predominant color on screen and change on device. Uses `node-vibrant` and `ffmpeg` under the hood. Not tested on Windows and Mac OS.

### Output Examples
> `yee list`: List devices. Sometimes, IP scan can fail
```sh
15:52:40 info:Discovery: Discovery success
15:52:41 info:Discovery: Found 0 devices via SSDP
15:52:41 info:Discovery: Performing IP scan to find devices
15:52:41 info:Discovery: YeelightID: null | Name: null | IP: xxx.xxx.0.191:55443
15:52:41 info:Discovery: Found 1 devices via IP scan
```
> `yee ambilight 'Kitchen,Living Room' 2560x1080 600 --debug`: Turn ambilight on for 'Kitchen' and 'Living Room' devices using 2560x1080 resolution with 600ms updates
```sh
16:00:00 info:Discovery: Discovery success
16:00:01 info:Discovery: YeelightID: 0x00000000112c0549 | Name: Kitchen | IP: xxx.xxx.0.199:55443
16:00:01 info:Discovery: YeelightID: 0x0000000011301d41 | Name: Living Room | IP: xxx.xxx.0.107:55443
16:00:01 info:Discovery: YeelightID: 0x0000000012a1c314 | Name: Bedroom | IP: xxx.xxx.0.191:55443
16:00:01 info:0x00000000112c0549:Kitchen: ⚡ Trying to connect into Kitchen in xxx.xxx.0.199:55443
16:00:01 info:0x0000000011301d41:Living Room: ⚡ Trying to connect into Living Room in xxx.xxx.0.107:55443
16:00:01 info:0x00000000112c0549:Kitchen: 📀 Starting music mode
16:00:01 info:0x0000000011301d41:Living Room: 📀 Starting music mode
16:00:01 debug:0x00000000112c0549:Kitchen: Command sent: {"id":9999,"method":"set_power","params":["on","smooth",300]}

16:00:01 debug:0x0000000011301d41:Living Room: Command sent: {"id":9999,"method":"set_power","params":["on","smooth",300]}

16:00:01 info:0x00000000112c0549:Kitchen: ⚡ Server Created!
16:00:01 info:0x00000000112c0549:Kitchen: ⚡ TCP Server Info: :::44659
16:00:01 debug:0x00000000112c0549:Kitchen: Command sent: {"id":9999,"method":"set_music","params":[1,"xxx.xxx.0.167",44659]}

16:00:01 info:0x0000000011301d41:Living Room: ⚡ Server Created!
16:00:01 info:0x0000000011301d41:Living Room: ⚡ TCP Server Info: :::43379
16:00:01 debug:0x0000000011301d41:Living Room: Command sent: {"id":9999,"method":"set_music","params":[1,"xxx.xxx.0.167",43379]}

16:00:01 info:0x00000000112c0549:Kitchen: 💡 Connected into Kitchen
16:00:01 info:0x0000000011301d41:Living Room: 💡 Connected into Living Room
16:00:01 info:0x00000000112c0549:Kitchen: ⚡ Device connected to server
16:00:01 info:0x0000000011301d41:Living Room: ⚡ Device connected to server
16:00:02 debug:main: ffmpeg proeminent color: #242c34 | brightness: 17
16:00:02 debug:0x00000000112c0549:Kitchen: Command sent: {"id":1,"method":"set_bright","params":[17,"smooth",600]}

16:00:02 debug:0x00000000112c0549:Kitchen: Command sent: {"id":2,"method":"set_rgb","params":[2370612,"smooth",600]}

16:00:02 debug:0x0000000011301d41:Living Room: Command sent: {"id":1,"method":"set_bright","params":[17,"smooth",600]}

16:00:02 debug:0x0000000011301d41:Living Room: Command sent: {"id":2,"method":"set_rgb","params":[2370612,"smooth",600]}

16:00:02 debug:main: ffmpeg proeminent color: #0c7acb | brightness: 39
16:00:02 debug:0x00000000112c0549:Kitchen: Command sent: {"id":3,"method":"set_bright","params":[39,"smooth",600]}

16:00:02 debug:0x00000000112c0549:Kitchen: Command sent: {"id":4,"method":"set_rgb","params":[817867,"smooth",600]}

16:00:02 debug:0x0000000011301d41:Living Room: Command sent: {"id":3,"method":"set_bright","params":[39,"smooth",600]}

16:00:02 debug:0x0000000011301d41:Living Room: Command sent: {"id":4,"method":"set_rgb","params":[817867,"smooth",600]}

16:00:03 debug:main: ffmpeg proeminent color: #0c7acb | brightness: 39
16:00:03 debug:0x00000000112c0549:Kitchen: Command sent: {"id":5,"method":"set_bright","params":[39,"smooth",600]}

16:00:03 debug:0x00000000112c0549:Kitchen: Command sent: {"id":6,"method":"set_rgb","params":[817867,"smooth",600]}

16:00:03 debug:0x0000000011301d41:Living Room: Command sent: {"id":5,"method":"set_bright","params":[39,"smooth",600]}

16:00:03 debug:0x0000000011301d41:Living Room: Command sent: {"id":6,"method":"set_rgb","params":[817867,"smooth",600]}
```
