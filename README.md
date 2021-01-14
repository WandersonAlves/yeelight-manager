# yeelight-manager

A service to super charge your yeelight use!

## WIP

To start, run `yarn dev` (or `npm run dev`) to spin up a express server with API endpoints.

Under your terminal, you'll see that `yeelight-manager` have found your bulbs. Remember that all your devices **must** be connected under the same network.

```
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

## Commands

You can get the postman collection of endpoints in `postman/` folder


### Set name
```
curl --location --request POST 'localhost:3000/yeelight/command' \
--header 'deviceId: {{deviceId}}' \
--header 'kind: name' \
--header 'name: Kitchen'
```
### Toggle device
```
curl --location --request POST 'localhost:3000/yeelight/command' \
--header 'deviceId: {{deviceId}}' \
--header 'kind: toggle'
```
### Start Ambilight
Set the color of a device based on what's happening on your screen
```
curl --location --request POST 'localhost:3000/yeelight/command' \
--header 'deviceId: {{deviceId}}' \
--header 'kind: ambilight' \
--header 'ip: 192.168.15.17'
```
### Stop Ambilight
Turns of ambilight feature
```
curl --location --request POST 'localhost:3000/yeelight/command' \
--header 'deviceId: {{deviceId}}' \
--header 'kind: cancel_ambilight'
```