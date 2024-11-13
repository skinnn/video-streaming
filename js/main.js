var filter = 'none',
		streaming = false
		width = 500,
		height = 0;

// DOM Elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const photos = document.getElementById('photos');
const photoBtn = document.getElementById('photo-button');
const deletePhotosBtn = document.getElementById('clear-photos-button');
const photoFilter = document.getElementById('photo-filter');

// Get media stream
navigator.mediaDevices.getUserMedia({ video: true, audio: false })
	.then((stream) => {
		video.srcObject = stream;
		video.play();
	})
	.catch((err) => console.error(err));

video.addEventListener('canplay', (e) => {
	if (!streaming) {
		height = video.videoHeight / (video.videoWidth / width);
		
		video.width = width;
		video.height = height;
		canvas.height = height;
		canvas.height = height;

		streaming = true;
	}
});

photoBtn.addEventListener('click', (e) => {
	takePicture();
	e.preventDefault();
});

// Take a picture from canvas
function takePicture() {
	// Create canvas
	const ctx = canvas.getContext('2d');
	if (width && height) {
		canvas.width = width;
		canvas.height = height;
		// Draw an image of the video
		ctx.drawImage(video, 0, 0, width, height);

		// Create image from the canvas
		const imgURL = canvas.toDataURL('image/png');
		const imgEl = document.createElement('img');
		imgEl.src = imgURL;
		// Set image filter
		imgEl.style.filter = filter;
		// Add download button
		const downloadBtn = document.createElement('a');
		const timestamp = new Date().getTime();
		downloadBtn.download = `image_${timestamp}.png`;
		downloadBtn.href = imgEl.src;
		downloadBtn.innerText = 'Download';
		// Delete button
		const deleteBtn = document.createElement('button');
		deleteBtn.innerText = 'Delete';
		deleteBtn.addEventListener('click', (e) => {
			const element = document.getElementById(timestamp);
			element.remove();
		});
		// Image content
		const content = document.createElement('div');
		content.id = timestamp;
		content.appendChild(imgEl)
		content.appendChild(downloadBtn)
		content.appendChild(deleteBtn)
		photos.appendChild(content);
	}
}

// Clear/delete photos
deletePhotosBtn.addEventListener('click', clearPhotos);
function clearPhotos() {
	photos.innerHTML = '';
	filter = 'none';
	video.style.filter = filter;
	photoFilter.selectedIndex = 0;
	
}

// Filter
photoFilter.addEventListener('change', (e) => {
	e.preventDefault();
	filter = e.target.value;
	video.style.filter = filter;
});