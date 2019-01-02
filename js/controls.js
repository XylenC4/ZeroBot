/*Idea and controls to node.js taken from "ZeroBotPro", see
https://github.com/CoretechR/ZeroBot

This script automatically picks the right IP for the stream 
Thanks to wonx (github.com/wonx) */
host = window.location.hostname;
//img = '<img src="http://' + host + ':9000/stream/video.mjpeg" style="height:100vh;"/>';
img = '<img src="http://' + host + ':9000/stream/video.mjpeg" style="height:100vh;width:100vw"/>';
document.getElementById("stream").innerHTML = img;
function takePicture() {
	socket.emit('cam', 1);
}
function shutdown() {
    if(confirm("This will shutdown the Pi.\nAre you sure?")){
		alert('Shutting down...\nPlease wait 20s before turning the power off.');
		socket.emit('power', 1);
	}
}
// Handle headlight button
function handleHeadlightClick(cb) {
	socket.emit('cam', 1);
}

// Handle slider
function updateSlider(cb) {
	socket.emit('slider', cb);  
}