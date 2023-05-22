# yeelight-manager

A CLI to super charge your yeelight use!

## Installation

`npm i -g yeelight-manager`

## Commands

1. `yee list` List all available devices. Uses SSDP method and port scanner method to retrieve devices.
1. `yee blink <name|id|ip>` Blink a device. Useful when you have multiple devices and wanna know with id/ip belongs to a device
2. `yee set <name|idip> <command> <value> [options]`
   1. `yee set <name|id|ip> name <name>` Sets a name for your device
   2. `yee set <name|id|ip> bright <1-100>` Change the brightness of a device. Any value below 1 will be threated as 1 and above 100 will be threated as 100;
   3. `yee set <name|id|ip> ct|temperature|color_temperature <1700~6500|default-temperatures> [bright]` Change the color temperature of a device. Any value below 1700 will be threated as 1700 and any value above 6500 will be threated as 6500;
      - Has the following default temperatures available: `cold`, `mid-cold`, `mid`, `mid-warm` and `warm`.
   4. `yee set <name|id|ip> color <hex-color|default-colors> [bright]` Change the color of the device;
      - Has the following default colors available: `red`, `blue`, `green`, `cyan`, `purple`, `pink`, `orange` and `yellow`.
   5. `yee set <name|id|ip> power <off|on>` Explicity turn on or off a device;
3. `yee setx "'Living Room' ct=9999 bright=100 Kitchen ct=9999 bright=100" --save 'Normal Room'` Set a custom command to later use
4. `yee toggle <name|id|ip>` Toggles a device;
5.  `yee ambilight <name|id|ip> <resolution|default-area> <interval> [options]` (**beta**) Using Yeelight's Music Mode, scan for dominant color on screen and use that color on device. Uses `rust` and `napi-rs` under the hood. Not tested on Windows.
    - `resolution`: Defines the area to fetch the dominant color. It's a string in format `<width>x<height>x<x>x<y>` or one of the `default-area` values.
      - `<width>x<height>x<x>x<y>`: `<width>x<height>` are required, `x` and `y` are optional
      - `default-area`: Can be `top`, `bottom`, `left` and `right`.
    - `interval`: Interval for fetching new colors. It's a number representing a `ms` value. Also, it can be a `fps` value, example: `yee ambiglight Bedroom top 30fps`. Due to the way the Yeelight's Bulb changes from color to color, the recomended `interval` is `150`.

### Output Examples
> `yee list`: List devices. Sometimes, IP scan can fail
```sh
17:38:58 info:Discovery: Discovery started...
17:39:00 info:Discovery: Found 5 devices via SSDP.
17:39:00 info:Discovery: Discovery finished.
17:39:00 info:Discovery: List of devices:
┌────────────────────┬─────────────┬─────────────────────┬─────┬──────┬───────┬────────────┐
│ DeviceID           │ Name        │ IP                  │ On? │ Mode │ Value │ Brightness │
├────────────────────┼─────────────┼─────────────────────┼─────┼──────┼───────┼────────────┤
│ 0x0000000012a1c314 │ Bedroom     │ 192.168.0.191:55443 │ Yes │ CT   │ 1700  │ 50         │
├────────────────────┼─────────────┼─────────────────────┼─────┼──────┼───────┼────────────┤
│ 0x0000000011301fe3 │ Corridor #1 │ 192.168.0.169:55443 │ Yes │ CT   │ 1700  │ 26         │
├────────────────────┼─────────────┼─────────────────────┼─────┼──────┼───────┼────────────┤
│ 0x0000000012a2d4ab │ Corridor #2 │ 192.168.0.162:55443 │ Yes │ CT   │ 5244  │ 29         │
├────────────────────┼─────────────┼─────────────────────┼─────┼──────┼───────┼────────────┤
│ 0x00000000112c0549 │ Kitchen     │ 192.168.0.199:55443 │ Yes │ CT   │ 2001  │ 100        │
├────────────────────┼─────────────┼─────────────────────┼─────┼──────┼───────┼────────────┤
│ 0x0000000011301d41 │ Living Room │ 192.168.0.107:55443 │ Yes │ CT   │ 4710  │ 100        │
└────────────────────┴─────────────┴─────────────────────┴─────┴──────┴───────┴────────────┘
```

> `yee ambilight Bedroom top 500 --debug`: Turn ambilight on for `Bedroom` device using `top` area for color tracking with 500ms updates
```sh
17:40:08 debug:Screenshot.GetScreenAreaDimensions: Value received: top
17:40:08 debug:Screenshot.GetScreenAreaDimensions: Value received from rust: 2560 x 1080
17:40:08 debug:AmbilightCmd: Interval MS: 500; Raw interval: 500
17:40:08 debug:ambilightCase: Received parameters
{
  "deviceNames": [
    "Bedroom"
  ],
  "height": 130,
  "width": 1280,
  "x": 640,
  "y": 100,
  "interval": 500,
  "useLuminance": true
}

17:40:10 debug:ambilightCase: Adding signal listeners
17:40:10 debug:ambilightCase: Listeners added
17:40:10 info:Bedroom: ⚡ Trying to connect into Bedroom in 192.168.0.191:55443
17:40:11 info:Bedroom: 💡 Connected into Bedroom
17:40:11 info:Bedroom: 📀 Starting music mode
17:40:11 info:Bedroom: ⚡ Server Created!
17:40:11 info:Bedroom: ⚡ TCP Server Info: :::61020
17:40:11 debug:Bedroom: Command sent: {"id":9999,"method":"set_music","params":[1,"192.168.0.104",61020]}

17:40:11 info:Bedroom: ⚡ Device connected to server
17:40:11 debug:Bedroom: Result event
{
  "method": "props",
  "params": {
    "music_on": 1
  }
}

17:40:11 verbose:Bedroom: music_on changed to 1
17:40:11 verbose:Bedroom: Props updated for
{
  "music_on": 1
}

17:40:11 debug:Bedroom: Result event
{
  "id": 9999,
  "result": [
    "ok"
  ]
}
17:40:12 debug:ambilightCase: Values from worker: {"color":"030304","factor":0.8627451062202454,"luminance":1.2047842741012573}
17:40:12 debug:Bedroom: Command sent: {"id":1,"method":"set_bright","params":[1.2047842741012573,"smooth",500]}

17:40:12 debug:Bedroom: Command sent: {"id":2,"method":"set_rgb","params":[197380,"smooth",500]}

17:40:12 debug:ambilightCase: Values from worker: {"color":"050507","factor":0.8784313797950745,"luminance":2.017411708831787}
17:40:12 debug:Bedroom: Command sent: {"id":3,"method":"set_bright","params":[2.017411708831787,"smooth",500]}

17:40:12 debug:Bedroom: Command sent: {"id":4,"method":"set_rgb","params":[328967,"smooth",500]}

^C

17:40:13 info:Bedroom: 📀 Finishing music mode
17:40:13 debug:Bedroom: Command sent: {"id":9999,"method":"set_music","params":[0,"192.168.0.104",61020]}

17:40:13 info:ambilightCase: 🦄 See you soon
```

### Troubleshooting

> *Can't find my devices via SSDP*

Try to turn off `IGMP Snooping` on your router (source: https://forum.yeelight.com/t/bulb-stops-to-respond-to-ssdp-requests-after-some-minutes/702)

> *Gets a `Error: connect EHOSTUNREACH` error*

If you're connected in VPN, please disconect and try again. (Problem reported on a macos 12.3.1 M1 Pro with Cisco Any Connect)