// some global variables
var previewing = false;
var shadow = document.querySelector('#shadow');
var slider = document.getElementById('slide-show-container');
var galleryImages = document.querySelectorAll('.gallery-image');
var previewImg = document.querySelector('.preview-image');
var toDiscardImage;
var curIndex = 0;
var slideshow = false;
var audios = document.querySelectorAll('audio');
var audio = document.querySelector('audio');
var audioSrcIndex = 0;
var audioSources = ["suddenly.mp3", "another.mp3", "beauty.mp3", "white.mp3"];
var currentHashLocation = null;
var singleImage = false;

function goBack(){
	history.back();
}
// use this to do close modals when back button is pressed
window.onhashchange = function() {
	var previewing = currentHashLocation == '#previewing' && location.hash !== '#menu';
	var playingSlideShow = currentHashLocation == '#slideshow' && location.hash !== '#menu';
    
    if(previewing || playingSlideShow){
    	currentHashLocation = null;
    	removeShadow();
    }
    if(currentHashLocation == "#menu" || location.hash == "#slideshow")
    	closeMoreMenu();

    currentHashLocation = location.hash;
    // console.log(location.hash);
}

window.onload = function(){
	window.location.hash = "";
	window.addEventListener('keyup', function(e){
		if(e.keyCode == 27)
			goBack();
	}, false)

	if(audios.length){
		audio.addEventListener('ended', function(){
			playNextSong();
		}, false);
	}

	var galleryImages = document.querySelectorAll('.gallery-image');
	var previewImg = document.querySelector('.preview-image');
	
	for (var i = 0; i < galleryImages.length; i++) {
		galleryImages[i].onclick = function(event){
			document.querySelector('.js-preview-menu').classList.add('js-relevant-menu');
			previewing  = true;
			location.hash = 'previewing';
			var image = this;
			var src = image.src;
			var caption = image.getAttribute('data-caption');
			var width = image.width;
			var height = image.height;
			var top = image.offsetTop;
			var left = image.offsetLeft;
			var scrollTop = (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0);
			// previewImg.style = {
			// 	top    : top+'px',
			// 	left   : left+'px',
			// 	height : height+'px',
			// 	width  : width+'px'
			// }
			// previewImg.setAttribute('src', src);
			// previewImg.classList.add('preview');
			var nodeList = Array.prototype.slice.call( document.getElementById('gallery').children );
			idx = nodeList.indexOf(image);

			rippleShadow(true, event.clientX+'px', event.clientY+'px', caption);
			setImages(src);
		}
	}

	var cards = document.querySelectorAll('.card');
	
	for (var i = 0; i < cards.length; i++) {
		cards[i].onclick = function(){
			card = this;
			previewing  = true;
			location.hash = 'previewing';
			rippleShadow(true, event.clientX+'px', event.clientY+'px');
			setTimeout(function(){
				card.classList.add('preview');
			}, 160);
		}
	}
}

function playSlideShowClicked(){
	closeMoreMenu();
	playSlideShow();
}
function playNextSongClicked(){
	goBack();
	playNextSong();
}

function toggleSlideShowClicked(){
	goBack();
	toggleSlideShow();
}

function playNextSong(){
	if(audioSrcIndex == audioSources.length - 1)
		audioSrcIndex = 0;
	else
		audioSrcIndex+=1;

	audio.src = "music/"+audioSources[audioSrcIndex];
	audio.play();
}

function toggleMusicClicked(){
	goBack();
	toggleMusic();
}

function toggleMusic(){
	if(audio.paused){
		audio.play();
		document.querySelector('.js-audio-toggler').innerText= 'Pause music';
	}
	else{
		audio.pause();
		document.querySelector('.js-audio-toggler').innerText = 'Play music';
	}
}

function setImages(idx){
	slider.classList.add('preview');

	if(idx){
		singleImage = true;
		var src = idx;
		toDiscardImage = new Image();
		toDiscardImage.src = src;
		toDiscardImage.classList.add('current');

		slider.appendChild(toDiscardImage);
	}else{
		if(document.querySelectorAll('.slideshow-image').length == 0){
			for (var i = 0; i < galleryImages.length; i++) {
				var caption = galleryImages[i].getAttribute('data-caption');
				var src = galleryImages[i].src;
				var image = new Image();

				image.classList.add('slideshow-image');
				image.setAttribute('src', src);
				image.setAttribute('data-caption', caption);

				if(i == curIndex){
					image.classList.add('current');
					document.querySelector('#caption').innerText = caption;
				}

				slider.appendChild(image);
			}
		}else{
			var image = document.querySelectorAll('.gallery-image')[curIndex];
			var caption = image.getAttribute('data-caption');

			image.classList.add('current');
			document.querySelector('#caption').innerText = caption;
		}
	}
}
function playSlideShow(startIndex){
	previewing = true;
	location.hash = currentHashLocation = 'slideshow';

	if(startIndex)
		curIndex = startIndex;

	if(document.querySelectorAll('.js-relevant-menu').length)
		document.querySelector('.js-relevant-menu').classList.remove('js-relevant-menu');

	document.querySelector('.js-slideshow-menu').classList.add('js-relevant-menu');
	document.querySelector('.js-slideshow-toggler').innerText= 'Stop slideshow';

	rippleShadow(true, event.clientX+'px', event.clientY+'px');
	setImages();
	audio.play();
	slideshow = setInterval(rollImages, 5000);
}

function stopSlideShow(){
	clearInterval(slideshow);
	audio.pause();
	slideshow = false;
}

function toggleSlideShow(){
	if(slideshow){
		stopSlideShow();
		document.querySelector('.js-slideshow-toggler').innerText= 'Play slideshow';
	}
	else{
		playSlideShow();
		document.querySelector('.js-slideshow-toggler').innerText= 'Stop slideshow';
	}
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
	location.hash = 'previewing';
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
	location.hash = currentHashLocation = "";
	// return scrolling ability to body
	document.body.classList.remove('locked');

	if(previewing){
		previewing = false;

		//return the previewed element to its original state
		document.querySelector('.preview').classList.remove('preview');

		if(document.querySelectorAll('.js-relevant-menu').length)
			document.querySelector('.js-relevant-menu').classList.remove('js-relevant-menu');

		if(singleImage){
			singleImage = false;
			slider.removeChild(toDiscardImage);
			console.log(slider);
		}
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

	if(document.querySelector('#caption'))
		document.querySelector('#caption').innerText = "";

	shadow.style = {
		top    : 0,
		left   : 0,
		width  : 100+'%',
		height : 100+'%'
	}

	if(slideshow){
		stopSlideShow();
	}

	if(audio)
		audio.pause();
}

function showMoreMenu(){
	location.hash = '#menu';

	if(document.querySelectorAll('.js-relevant-menu').length)
		document.querySelector('.js-relevant-menu').classList.add('show');
}

function closeMoreMenu(){
	if(document.querySelectorAll('.js-relevant-menu').length)
		document.querySelector('.js-relevant-menu').classList.remove('show');
}