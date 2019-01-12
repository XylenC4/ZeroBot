# ZeroBot
Raspberry Pi Zero FPV Robot with uv4l and mobile support.

In difference to the [original project](https://github.com/CoretechR/ZeroBot):
- Code has cleaned up (a bit)
- Video is based on [uv4l](https://www.linux-projects.org/uv4l/)
- Touch support is based on the project [PEP](https://github.com/jquery/PEP)
- Slider on the bottom to correct if the motors are not equal to drive straight
- Apache is not used (script works on port 80)

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
- Put the SD-Card into the Raspberry Pi & boot it up.

## Raspbian enable Camera & i2c
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
sudo apt install nodejs npm git pigpio -y
sudo apt-get install uv4l uv4l-webrtc uv4l-raspicam-extras -y
```

## UV4L Set-Up
```bash
sudo sed -i -e 's/# server-option = --port=8080/server-option = --port=9000/g' /etc/uv4l/uv4l-raspicam.conf
sudo sed -i -e 's/# width = /width = /g' /etc/uv4l/uv4l-raspicam.conf
sudo sed -i -e 's/# height = /height = /g' /etc/uv4l/uv4l-raspicam.conf
sudo sed -i -e 's/framerate = 30/framerate = 15/g' /etc/uv4l/uv4l-raspicam.conf
sudo sed -i -e 's/# quality =/quality =/g' /etc/uv4l/uv4l-raspicam.conf
sudo sed -i -e 's/# stills-denoise/stills-denoise/g' /etc/uv4l/uv4l-raspicam.conf
sudo sed -i -e 's/# rotation = 0/rotation = 180/g' /etc/uv4l/uv4l-raspicam.conf
sudo service uv4l_raspicam restart
```

## Install this repository & dependencies
```bash
git clone https://github.com/XylenC4/ZeroBot.git ZeroBot
cd ZeroBot
npm install express
npm install socket.io
npm install pigpio
npm install node-ads1x15
```

## Add automatic startup
```bash
sudo sed -i '$d' /etc/rc.local
echo 'cd /home/pi/ZeroBot' | sudo tee -a /etc/rc.local
echo 'sudo node app.js&' | sudo tee -a /etc/rc.local
echo 'cd' | sudo tee -a /etc/rc.local
echo 'exit 0' | sudo tee -a /etc/rc.local
```
## Test (without restart)
```bash
sudo service uv4l_raspicam restart
sudo node app.js
```
Connect to your raspberry pi using the webbrowser of your choice (Port:80)
