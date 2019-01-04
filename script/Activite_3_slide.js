/* --------------------------------------------*/
/* Section Slide                               */
/*---------------------------------------------*/


/* --------------------------------------------*/
/* Création de l'objet Slide                   */
/*---------------------------------------------*/

var Slide =  { 
    nbSlides : null, 
    time : 0,
    slideIndex : 1,
    flecheG : null,
    flecheD : null,

    /* --------------------------------------------*/
    /* Méthode d'initialisation                    */
    /*---------------------------------------------*/
    init : function (nbSlides, flecheG, flecheD) // Méthode d'initialisation 
    {
        this.nbSlides = nbSlides;
        this.flecheG = flecheG;
        this.flecheD = flecheD;
        this.displaySlide(0,0,this.nbSlides,this.slideIndex,this) ;
        this.click();
        this.keydown();  
    },

    /* --------------------------------------------*/
    /* Affiche un des slides toutes les 6 secondes */
    /*---------------------------------------------*/   
    displaySlide : function (p, n, mySlides, slideIndex, objet) {
        var total = mySlides.length; 
        slideIndex += p;
        if (slideIndex > total) {slideIndex = 1};
        if (slideIndex < 1) {slideIndex = total}; 
        if (n == 0 && p == 0) { 
            objet.time = setTimeout(objet.displaySlide, 6000,1,1, mySlides, slideIndex, objet);
            for (var i = 0; i < total; i++) {
                $(mySlides[i]).hide();
            };
            $(mySlides[slideIndex-1]).fadeToggle('slow');
        } else  { 
            clearTimeout(objet.time); 
            objet.displaySlide(0,0, mySlides, slideIndex, objet);
        }; 
        this.slideIndex = slideIndex;
    },




    /* --------------------------------------------------*/
    /* Evénement souris pour passer d'un slide à l'autre */
    /*---------------------------------------------------*/ 
    click : function () { //Evenements souris
        var objet = this;
        flecheG.addEventListener("click", function () {   
            objet.previous();
        });
        flecheD.addEventListener("click", function () {   
            objet.next(); 
        });    
    }, 

    /* ---------------------------------------------------*/
    /* Evénement clavier pour passer d'un slide à l'autre */
    /*----------------------------------------------------*/ 
    keydown : function () {
        var objet = this;
        document.addEventListener("keydown", function(e){
            if(e.keyCode === 37){
                objet.previous();
            } else if(e.keyCode === 39){
                objet.next();
            }
        });
    },

    /* --------------------------------------------*/
    /* Slide précédent                             */
    /*---------------------------------------------*/ 
    previous : function () {
        this.displaySlide(-1,1,this.nbSlides,this.slideIndex,this) ;
    },
    /* --------------------------------------------*/
    /* Slide suivant                               */
    /*---------------------------------------------*/ 
    next : function () { 
        this.displaySlide(1,1,this.nbSlides,this.slideIndex,this);
    },
};

   




























