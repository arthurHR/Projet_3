/* --------------------------------------------*/
/* Section timer du programme                  */
/*---------------------------------------------*/


/* --------------------------------------------*/
/* Création de l'objet timer                   */
/*---------------------------------------------*/
        
var timer = {
    twentyMinutesLater : 0,
    time : 0,
    now : 0,
    distance : 0,
    interval : 0,
    address : null,
    marker: null,
    cancel : null,
    map : null,

    /* --------------------------------------------*/
    /* Initialistaion de l'objet timer             */
    /*---------------------------------------------*/
    init : function (marker,cancel ,map) {
        this.marker = marker;
        this.address = marker.address;
        this.cancel = cancel;
        this.map = map;
        this.setTime(1,this);
        //sessionStorage.setItem("map",this.map);


    },
    /* --------------------------------------------------------*/
    /* Calcul du temps et envoi des donnés dans sessionStorage */
    /*---------------------------------------------------------*/
    setTime : function (n,newobjet){
        objet = newobjet;
        objet.time++;
        if ( objet.time >= 1){
            objet.now = new Date().getTime();
        }
        if ( objet.time == 1 && sessionStorage.length == 0 ) {
            objet.twentyMinutesLater = new Date().getTime() + 1200100;
        } 
        if (sessionStorage.length > 0) {
            objet.twentyMinutesLater = sessionStorage.getItem("time") 
            objet.address = sessionStorage.getItem("address"); };
            objet.distance = objet.twentyMinutesLater - objet.now;
        // Time calculations for days, hours, minutes and seconds
            var minutes = Math.floor((objet.distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((objet.distance % (1000 * 60)) / 1000);
        if  (objet.distance > 0) {
            sessionStorage.setItem("address",objet.address);
            sessionStorage.setItem("time",objet.twentyMinutesLater);
            document.getElementById("timer").innerHTML ="Vous avez réservé un vélo à la station " + objet.address + "." +  " Votre réservation  s'écoulera dans " + minutes + " minutes " + seconds + " secondes ";
            objet.interval = setTimeout(objet.setTime,1000,1, objet);
        } else {       
            $("#cancelResa").hide();
            clearTimeout(objet.interval);         
            objet.interval = 0;
            sessionStorage.clear();
            objet.time = 0;
            this.map.initMap();
            jQuery("#timer").text("Votre réservation à " + objet.address +" a expirée");
        };
    },
    
    /* --------------------------------------------*/
    /* Annulation de la réservation                */
    /*---------------------------------------------*/
    cancelResa : function (){
        this.distance = 0;
        jQuery("#timer").text("Votre réservation à " + this.address + " a été annulée");
        sessionStorage.clear();
        clearTimeout(this.interval);         
        this.time = 0;
    },
};


                


