# ZeroBot
Raspberry Pi Zero FPV Robot with uv4l and mobile support

# Usage

## Raspbian
Download Raspbian lite
Put Raspbian on a SD-Card
Generate a new Text-File called "wpa_supplicant.conf"

Put in there: (With your network informations)
```bash
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
network={
	ssid="WiFi Name"
	psk="WiFi password"
}
```
