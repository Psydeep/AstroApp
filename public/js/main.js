$(document).ready(main);
 
var contador = 1;
 
function main () {
	$('.menubar').click(function(){
		if (contador == 1) {
			$('nav').animate({
				left: '0'
			});
			contador = 0;
		} else {
			contador = 1;
			$('nav').animate({
				left: '-100%'
			});
		}
	});
 
	// Mostramos y ocultamos submenus
	//$('.submenu').click(function(){
		//$(this).children('.children').slideToggle();
	//});

	//cerrar solo menu con boton li
	//Cerrar solo el menu
	$('.cerrar').click(function(){
		if (contador == 0) {
			$('nav').animate({
			left: '-100%'
			});
			contador = 1;
		}
	});

	//$(window).load(function(){
	//	$("#inner").attr({
	//		'style': 'height: 1067px'
	//	});
	//});
	
}

