# ZeroBot
Raspberry Pi Zero FPV Robot with uv4l and mobile support

# Usage

## Raspbian
- Download Raspbian lite
- Put Raspbian on a SD-Card
- Generate a new Text-File called "wpa_supplicant.conf" on the "boot" partition
- Put in there: (With your network informations)
```bash
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
network={
	ssid="WiFi Name"
	psk="WiFi password"
}
```
- Generate a new Text-File called "SSH" on the "boot" partition


## Raspbian Set-Up
- Connect to the Raspberry Pi via SSH
- Enable the Camera and i2c using:
```bash
sudo raspi-config
```
- Update & install dependencies:
```bash
curl http://www.linux-projects.org/listing/uv4l_repo/lpkey.asc | sudo apt-key add -
echo 'deb http://www.linux-projects.org/listing/uv4l_repo/raspbian/stretch stretch main' | sudo tee -a /etc/apt/sources.list
	
sudo apt update -y
sudo apt upgrade -y
sudo rpi-update -y
sudo apt install apache2 nodejs npm git pigpio -y
sudo apt-get install uv4l uv4l-webrtc uv4l-raspicam-extras -y
```
