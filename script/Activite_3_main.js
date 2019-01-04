
// A $( document ).ready() block.
$( document ).ready(function() {
	/*---------------------------------------------------*/
	/* Instanciation de l'objet map                      */
	/*---------------------------------------------------*/  
	var myMap = Object.create(map);
	var apiKey = 'https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=027afe415d16ed69034afc59c472986d71b4fbce';
	myMap.initMap(apiKey);

	/* --------------------------------------------*/
	/* Instanciation de l'objet Slide               */
	/*---------------------------------------------*/ 
	mySlide = Object.create(Slide); 
	var mySlides = document.getElementsByTagName('figure');
	var flecheG  = document.getElementById("flecheG");
	var flecheD = document.getElementById("flecheD");
	mySlide.init(mySlides, flecheG , flecheD);
});
