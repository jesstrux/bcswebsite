window.onloads = function(){
	document.querySelector('#shadow').classList.add('show');
	document.querySelector('#shadow').classList.add('loading');

	setTimeout(function(){
		document.querySelector('#shadow').classList.remove('show');
		document.querySelector('#shadow').classList.remove('loading');
	}, 3000);
}

function playSlideShow(){
	document.querySelector('audio').play();
}

function toggleMenu(){
	if(document.querySelector('nav').classList.contains('open')){
		document.querySelector('#shadow').classList.remove('show');
		document.querySelector('nav').classList.remove('open');
		document.body.classList.remove('locked');
	}else{
		document.querySelector('#shadow').classList.add('show');
		document.querySelector('nav').classList.add('open');
		document.body.classList.add('locked');
	}
}

function closeMenu(){
	if(document.querySelector('nav').classList.contains('open')){
		document.querySelector('#shadow').classList.remove('show');
		document.querySelector('nav').classList.remove('open');
		document.body.classList.remove('locked');
	}
}

window.onresize = function(event) {
	closeMenu();
};