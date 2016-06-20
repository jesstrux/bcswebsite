window.onscroll = function(){
	keepFabAboveFooter();
}

function keepFabAboveFooter(){
	var scrollTop = (window.pageYOffset || document.scrollTop)  - (document.clientTop || 0);
	var footer = document.querySelector('footer');
	var fab = document.querySelector('.btn-fab');
	var distanceAboveFooter = (footer.offsetTop - (scrollTop || 0) - window.innerHeight - 55);

	if(distanceAboveFooter >= 0){
		fab.style.position = 'fixed';
		fab.style.bottom = 10+'px';
	}
	else{
		fab.style.position = 'absolute';
		fab.style.bottom = 35+'px';
	}
}