// some global variables
var previewing = false;
var shadow = document.querySelector('#shadow');
var curIndex = 0;
var slideshow;
var audio = document.querySelector('audio');
var audioSrcIndex = 0;
var audioSources = ["suddenly.mp3", "another.mp3", "beauty.mp3", "white.mp3"];

window.onload = function(){
	// shadow.classList.add('loading');

	// setTimeout(function(){
	// 	removeShadow();
	// }, 3000);
	// playSlideShow();

	window.addEventListener('keyup', function(e){
		if(e.keyCode == 27)
			removeShadow();
	}, false)

	audio.addEventListener('ended', function(){
		if(audioSrcIndex == audioSources.length - 1)
			audioSrcIndex = 0;
		else
			audioSrcIndex+=1;

		audio.src = "music/"+audioSources[audioSrcIndex];
		audio.play();
	}, false);

	var galleryImages = document.querySelectorAll('.gallery-image');
	var previewImg = document.querySelector('.preview-image');
	
	for (var i = 0; i < galleryImages.length; i++) {
		galleryImages[i].onclick = function(event){
			previewing  = true;
			var src = this.src;
			var caption = this.getAttribute('data-caption');

			previewImg.setAttribute('src', src);
			// previewImg.style = {
			// 	top  : event.clientY+'px',
			// 	left : event.clientX+'px'
			// }
			previewImg.classList.add('preview');
			rippleShadow(true, event.clientX+'px', event.clientY+'px', caption);
		}
	}

	var cards = document.querySelectorAll('.card');
	
	for (var i = 0; i < cards.length; i++) {
		cards[i].onclick = function(){
			card = this;
			previewing  = true;
			rippleShadow(true, event.clientX+'px', event.clientY+'px');
			setTimeout(function(){
				card.classList.add('preview');
			}, 160);
		}
	}
}

function playSlideShow(){
	previewing = true;
	rippleShadow(true, event.clientX+'px', event.clientY+'px');
	audio.play();
	var slider = document.getElementById('slide-show-container');
	var galleryImages = document.querySelectorAll('.gallery-image');
	var previewImg = document.querySelector('.preview-image');
	
	slider.classList.add('preview');

	if(document.querySelectorAll('.slideshow-image').length == 0){
		for (var i = 0; i < galleryImages.length; i++) {
			var caption = galleryImages[i].getAttribute('data-caption');
			var src = galleryImages[i].src;
			var image = new Image();

			image.classList.add('slideshow-image');
			image.setAttribute('src', src);
			image.setAttribute('data-caption', caption);

			if(i == 0){
				image.classList.add('current');
				document.querySelector('#caption').innerText = caption;
			}

			slider.appendChild(image);
		}
	}

	slideshow = setInterval(rollImages, 5000);
}

function rollImages(){
	var slideshowImages = document.querySelectorAll('.slideshow-image');
	var maxCount  = slideshowImages.length;
	var curImage  = slideshowImages[curIndex];
	var nextIndex = curIndex == parseInt(maxCount - 1) ? 0 : parseInt(curIndex + 1);
	var nextImage = slideshowImages[nextIndex];
	var prevIndex = curIndex == 0 ? parseInt(maxCount - 1) : parseInt(curIndex - 1);
	var prevImage = slideshowImages[prevIndex];
	var caption = nextImage.getAttribute('data-caption');

	curImage.classList.add('slide-left');
	nextImage.classList.add('scale-in-up');
	document.querySelector('#caption').innerText = caption;

	setTimeout(function(){
		curImage.classList.remove('slide-left');
		curImage.classList.remove('current');
	}, 300);

	setTimeout(function(){
		nextImage.classList.remove('scale-in-up');
		nextImage.classList.add('current');
	}, 800);

	// console.log(maxCount);
	if(curIndex == maxCount - 1){
		console.log("Resetting!");
		curIndex = 0;
	}
	else
		curIndex++;
}

function toggleMenu(){
	if(document.querySelector('nav').classList.contains('open')){
		removeShadow();
		document.querySelector('nav').classList.remove('open');
		document.body.classList.remove('locked');
	}else{
		showShadow();
		document.querySelector('nav').classList.add('open');
	}
}

function closeMenu(){
	if(document.querySelector('nav').classList.contains('open')){
		document.querySelector('nav').classList.remove('open');
		document.body.classList.remove('locked');
	}
}

// Show shadow without ripple
function showShadow(dark){
	document.body.classList.add('locked'); //prevent body from scrolling when shadow is open

	if(dark) // reduce transparency
		shadow.classList.add('darkened');

	// add the class show to show it
	shadow.classList.add('show');
}

function rippleShadow(dark, startX, startY, caption){
	document.body.classList.add('locked'); //prevent body from scrolling when shadow is open

	if(dark) // reduce transparency
		shadow.classList.add('darkened');

	if(startX && startY){
		// set ripple's start position(normally at click position)
		shadow.style.top = startY;
		shadow.style.left = startX
	}

	if(caption)
		document.querySelector('#caption').innerText = caption;

	// add the show-as-ripple class to perform the ripple
	shadow.classList.add('show-as-ripple');
}

function removeShadow(){
	// return scrolling ability to body
	document.body.classList.remove('locked');

	if(previewing){
		previewing = false;

		//return the previewed element to its original state
		document.querySelector('.preview').classList.remove('preview');;
	}

	// remove all classes that allow shadow to be shown
	if(shadow.classList.contains('show')){
		shadow.classList.remove('show');
	}
	else if(shadow.classList.contains('show-as-ripple')){
		shadow.classList.remove('show-as-ripple');
	}

	closeMenu();
	
	// remove all extra shadow properties that might have been added on initialization
	shadow.classList.remove('darkened');
	shadow.classList.remove('loading');

	document.querySelector('#caption').innerText = "";
	shadow.style = {
		top    : 0,
		left   : 0,
		width  : 100+'%',
		height : 100+'%'
	}

	clearInterval(slideshow);
	curIndex = 0;
	document.querySelector('audio').pause();
}

// window.onresize = function(event) {
// 	closeMenu();
// };