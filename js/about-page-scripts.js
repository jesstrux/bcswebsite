var canvas, ctx, anim;
var ch, cw;
var unCode = '#f44336'; //color code for unemplyed students
var emCode = '#00bcd4'; //color code for employed students
var frCode = '#cddc39'; //color code for freelancing students
var curYear = 2007;

var unRatio, unRatioInv, unText, untw;
var frRatio, frRatioInv, frText, frtw;
var emRatio, emRatioInv, emText, emtw;

requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
})();

function init(){
	canvas = document.querySelector('canvas');
	ctx = canvas.getContext('2d');
	ctx.font = "0.9em Helvetica";

	ch = canvas.height;
	cw = canvas.width;

	getValues(curYear);
}

document.querySelector('select').onchange = function(){
	getValues(this.value);
}

var studentsData = {
	2007 : {
		un : 100,
		em : 300,
		fr : 500
	},
	2008 : {
		un : 200,
		em : 150,
		fr : 700
	},
	2009 : {
		un : 400,
		em : 100,
		fr : 200
	},
	2010 : {
		un : 100,
		em : 400,
		fr : 300
	},
	2011 : {
		un : 50,
		em : 200,
		fr : 100
	},
	2012 : {
		un : 400,
		em : 400,
		fr : 300
	},
	2013 : {
		un : 100,
		em : 400,
		fr : 100
	},
	2014 : {
		un : 500,
		em : 400,
		fr : 200
	},
	2015 : {
		un : 150,
		em : 200,
		fr : 400
	},
	2015 : {
		un : 150,
		em : 200,
		fr : 400
	}
};

function getValues(year){
	var yrObj = studentsData[year];
	var un = parseFloat(yrObj.un);
	var em = parseFloat(yrObj.em);
	var fr = parseFloat(yrObj.fr);
	var tot  =  un + fr + em;

	unRatio = un / tot;
	emRatio = em / tot;
	frRatio = fr / tot;

	setValues();
}

function setValues(){
	unRatioInv = 1.0 - unRatio;
	unText = parseInt(unRatio * 100) + '%';
	untw = ctx.measureText(unText);

	emRatioInv = 1.0 - emRatio;
	emText = parseInt(emRatio * 100) + '%';
	emtw = ctx.measureText(emText);
	
	frRatioInv = 1.0 - frRatio;
	frText = parseInt(frRatio * 100) + '%';
	frtw = ctx.measureText(frText);

	anim = 0;

	loop();
}

function loop(){
	drawLoop = requestAnimFrame(loop);

	if(anim < 1){
		anim+=0.07;

		if(anim > 1)
			anim = 1;
	}else{
		cancelRequestAnimFrame(drawLoop);
	}

	drawRectangles();
};
function drawRectangles(){
	console.log("looping");
	ctx.clearRect(0, 0, cw, ch);

	// ch*=anim;

	// draw bar for freelancers
	ctx.fillStyle = frCode;
	ctx.fillText(frText, 35, (frRatioInv * ch) + 10 + (ch * (1 - anim)));
	ctx.fillRect(35, (frRatioInv * ch) + 12 + (ch * (1 - anim)), 40, (frRatio * ch));

	// draw bar for employed
	ctx.fillStyle = emCode;
	ctx.fillText(emText, 135, (emRatioInv * ch) + 10 + (ch * (1 - anim)));
	ctx.fillRect(135, (emRatioInv * ch) + 12 + (ch * (1 - anim)), 40, (emRatio * ch) - 12);

	// draw bar for unemployed
	ctx.fillStyle = unCode;
	ctx.fillText(unText, 235, (unRatioInv * ch) + 10 + (ch * (1 - anim)));
	ctx.fillRect(235, (unRatioInv * ch) + 12 + (ch * (1 - anim)), 40, (unRatio * ch) - 12);
}

window.onload = function(){
	init();
}