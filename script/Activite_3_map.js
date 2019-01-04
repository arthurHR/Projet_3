/*_____________________________________________*/
/* Programme de gestion de réservation du parc */
/* Créateur : Artur Richard                    */
/* Date de création : le 19/08/2018            */
/* Modification le :      par                  */
/* --------------------------------------------*/


/* --------------------------------------------*/
/* Corps du programme                          */
/*---------------------------------------------*/


/* --------------------------------------------*/
/* Création de l'objet map                     */
/*---------------------------------------------*/
var map = { 
    detailStation : document.getElementById('detailStation'),
    image : null,
    detailMarker : null,
    newDetailMarker : null,
    confirmMarker : null,
    icon : null,
    canvas : null,
    timer : null,
    carte : null,
    apiKey : null,

    /*---------------------------------------------------*/
    /* Initialisation de la map + style                  */
    /*---------------------------------------------------*/
    initMap : function (apiKey) {
        this.apiKey = apiKey;
        var lyon = {lat: 45.75, lng: 4.85};
        this.carte = new google.maps.Map (
            document.getElementById('map'), { zoom: 13, 'mapTypeId': google.maps.MapTypeId.ROADMAP, center: lyon,  styles : 
                [{"elementType":"geometry","stylers":[{"color":"#ebe3cd"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#523735"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f1e6"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#c9b2a6"}]},{"featureType":"administrative.land_parcel","elementType":"geometry.stroke","stylers":[{"color":"#dcd2be"}]},{"featureType":"administrative.land_parcel","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#ae9e90"}]},{"featureType":"landscape.natural","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#dfd2ae"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"visibility":"off"}]}]
            }
        );

        /*---------------------------------------------------*/
        /* Méthodes de l'objet map dans initMap              */
        /*---------------------------------------------------*/  

        this.start();
        this.clickBookedEvent();
        this.validResaEvent(); 
        this.cancelReservation();
        this.addMarker();
        this.reloadMarker();
        this.storage();
        this.slowEffect();
    },

    /*--------------------------------------------------------*/
    /* Défnit les éléments présents au démarrage du programme */                
    /*--------------------------------------------------------*/

    start : function (){
        $('#infoAccueil').show();
        $('#adressResa').hide();
        $("#initMap").show();
        $("#alreadyBooked").hide();
        $("#Canvas").hide();
        $("#confirmResa").hide(); 
        $("#detailStation").hide();
    },

    /*---------------------------------------------------*/
    /* En cas de réservation déjà en cours               */
    /*---------------------------------------------------*/
    storage : function (){
        if (sessionStorage.length > 0 ){
            var address = sessionStorage.getItem("address");    
            this.detailMarker = address;
            this.timer = Object.create(timer);
            this.timer.init(address,cancel,this); 
            $("#cancelResa").show();
        } else {
            jQuery("#timer").text("Vous n'avez effectué aucune réservation");
            $("#cancelResa").hide();
        };         
    },

    ajaxGet: function (url, callback) {
        var req = new XMLHttpRequest();
        req.open("GET", url);
        req.addEventListener("load", function () {
            if (req.status >= 200 && req.status < 400) {
                callback(req.responseText);
            } else {
                console.error(req.status + " " + req.statusText + " " + url);
            }
        });
        req.addEventListener("error", function () {
            console.error("Erreur réseau avec l'URL " + url);
        });
        req.send(null);
    },

    /*-----------------------------------------------------------*/
    /* Interroge l'API JCdecaux                                  */
    /*-----------------------------------------------------------*/ 
    addMarker: function () {
        var objet = this;
        this.ajaxGet( this.apiKey, function (reponse) {
            var stations = JSON.parse(reponse);                      
            objet.createMarker(stations);
        });   
    },


    /*-----------------------------------------------------------*/
    /* Création des marqueurs grâce aux données de l'API JCdcaux */
    /*-----------------------------------------------------------*/ 
    createMarker: function (stations) { 
        var markers = new Array();
        var map = this.carte;
        for (var i=0 ; i < stations.length ; i++) {
            var posX = stations[i].position.lat;
            var posY = stations[i].position.lng; 
            var myLatlng = new google.maps.LatLng(posX,posY);    
            var marker = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: stations[i].name,
                address : stations[i].address,
                status : stations[i].status,
                places_disponibles : stations[i].available_bike_stands,
                velos_disponibles : stations[i].available_bikes,
            });
            markers.push(marker)                
            this.setIcon(marker);
            this.clickMarker(marker);
        };
        var markerCluster = new MarkerClusterer(map, markers, {imagePath:   'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    }, 




    /*---------------------------------------------------*/
    /*   Définit les icônes des marqueurs                */
    /*---------------------------------------------------*/
    setIcon : function (coords){
        if (coords.status == "CLOSED") {
            coords.setIcon("images/marker_brown.png");
        } else if (sessionStorage.length > 0 && coords.address == this.detailMarker)                           {
            coords.setIcon("images/marker_blue.png");
            this.detailMarker = coords;
        } else if (coords.velos_disponibles == 0){
            coords.setIcon("images/marker_pink.png");
        } else {coords.setIcon("images/marker_green.png"); 
        };       
    },

    /*---------------------------------------------------*/
    /* Evénement clique sur un marqueur                  */
    /*---------------------------------------------------*/
    clickMarker: function (marker) {
        var objet = this;
        google.maps.event.addListener(marker, "click", function () {
            objet.loadPage++;
            this.setAnimation(google.maps.Animation.DROP);
            objet.detailsStation(marker);
            $("#detailStation").show();
            $('#infoAccueil').hide();
            $('#reserver').show();
            $('#cancel').hide();
            $('#adressResa').hide();
            $("#initMap").show();       
        });
    }, 

    /*---------------------------------------------------*/
    /* Affiche les détails de la station                 */
    /*---------------------------------------------------*/ 
    detailsStation : function (Object) {
        if (Object.status == "OPEN"){
            jQuery('#title').text(Object.title ) ;            
            jQuery('#adress').text( "Adresse : " + " " + Object.address ) ;
            jQuery('#status').text( "" );
            jQuery('#available_place').text( "Emplacements disponibles : " +      Object.places_disponibles );
            jQuery('#available_bike').text( "Vélos disponibles : " + " " + Object.velos_disponibles ) ;
        } else {
            jQuery('#status').text( "Desolé, la station est fermée pour le moment" ) ;
            jQuery('#available_place').text("");
            jQuery('#available_bike').text("");
        };
        if (sessionStorage.length > 0 ){
            this.newDetailMarker = Object;
            this.showBooked(this.newDetailMarker);
        } else {
            this.detailMarker = Object;
            this.showBooked(this.detailMarker);
        };                   
    },




    /*--------------------------------------------------------------------------------------*/
    /* Affiche ou non le bouton réserver selon l'état de la station et les vélos disponible */
    /*--------------------------------------------------------------------------------------*/
    showBooked: function(station){
        $('#confirmResa').show();
        if (station.velos_disponibles > 0) {
            $('#booked').show();
            $('#nobooked').hide();
        }
        else if (station.status == "CLOSED"){
            $("#booked").hide();
            $("#nobooked").hide(); 
        } 
        else {
            $("#booked").hide();
            $("#nobooked").show();
        }
    },


    /*---------------------------------------------------*/
    /* Evenement clique du bouton réserver               */
    /*---------------------------------------------------*/
    clickBookedEvent: function () {
        $("#Canvas").hide();
        $("#valid").hide();
        $("#clear").hide();
        $("#cancel").hide();
        this.clickClearCanvas();
        this.clickCancelBooked();
        var objet = this;
        document.getElementById("booked").addEventListener("click", function () {
            if (sessionStorage.length > 0){
                $("#alreadyBooked").show();
                document.getElementById("validAnotherB").addEventListener("click", function (){
                    $("#detailStation").hide();
                    $("#initMap").hide();
                });
                document.getElementById("cancelAnotherB").addEventListener("click", function (){
                    $("#alreadyBooked").hide();
                });
            } else {
                $("#cancel").show();
                $("#initMap").hide();  
                $("#Canvas").show();
                $("#detailStation").hide();
                objet.createCanvas();
            };
        });
    },

    /*---------------------------------------------------*/
    /* Evénement clique qui réinitialise le canvas              */
    /*---------------------------------------------------*/
    clickClearCanvas:function () {  
        document.getElementById("clear").addEventListener("click", function () {
            var myCanvas = Object.create(objCanvas);
            myCanvas.clearCanvas();
            $("#valid").hide();
            $("#clear").hide();
        }); 
    },

    /*---------------------------------------------------------------------------*/
    /* Evénement clique qui renvoi au détail de la station et au bouton réserver */
    /*---------------------------------------------------------------------------*/
    clickCancelBooked () {
        var objet = this;
        document.getElementById("cancel").addEventListener("click", function () {
            objet.clearCanvas();
            $("#reserver").show();
            $("#detailStation").show();
            $("#adressResa").hide();
            $("#cancel").hide();
            $("#Canvas").hide();
            $("#valid").hide();
            $("#clear").hide();
            $('#initMap').show();
        });
    },



    /*---------------------------------------------------*/
    /* Instanciation d'un nouvel objet canvas            */
    /*---------------------------------------------------*/
    createCanvas : function (){
        this.canvas = Object.create(objCanvas);
        canvas = document.getElementById("myCanvas");
        valid = document.getElementById("valid");
        clear = document.getElementById('clear');
        this.canvas.init(canvas,valid,clear); 
    },

    /*---------------------------------------------------*/
    /* Utilise la méthode clear Canvas de l'objet canvas */
    /*---------------------------------------------------*/
    clearCanvas : function (){
        var canvas = this.canvas;
        canvas.clearCanvas();
        $("#valid").hide();
        $("#clear").hide();
        $("#Canvas").hide();
        $("#cancel").hide();
    },

    /*---------------------------------------------------*/
    /* Evenement click de la validation de la résa       */
    /*---------------------------------------------------*/
    validResaEvent : function (){
        var objet = this;
        document.getElementById("valid").addEventListener("click", function () {
            objet.validResa();
        });
        document.getElementById("validAnotherB").addEventListener("click", function ()                     {
            objet.validResa();
        });
    },




    /*---------------------------------------------------*/
    /* Aller sur la section footer                       */
    /*---------------------------------------------------*/
    validResa : function () {
        this.validReservation();  
        window.location.href = "#"+"timer";
    },

    /*---------------------------------------------------*/
    /* Validation de la réservation                      */
    /*---------------------------------------------------*/
    validReservation : function (){
        if (sessionStorage.length > 0 ){
            this.newDetailMarker.setIcon("./images/marker_blue.png");
            this.setIcon(this.detailMarker);
            this.detailMarker = this.newDetailMarker;
            objet.cancelResa();
        } else {
            this.detailMarker.setIcon("./images/marker_blue.png");
            var myCanvas = Object.create(objCanvas);
            this.clearCanvas();
        };
        sessionStorage.clear();
        $("#cancelResa").show(); 
        this.loadPage = 0;
        this.createTimer();
        this.start();
    },


    /*---------------------------------------------------*/
    /* Création de l'objet timer (compte à rebours)      */
    /*---------------------------------------------------*/ 
    createTimer : function (){
        var objet = this;
        objet.timer = Object.create(timer);
        marker = this.detailMarker;
        cancel = document.getElementById("cancelResa");
        objet.timer.init(marker,cancel,objet);
    },


    /*---------------------------------------------------*/
    /* Evénement clique qui annule la réservation        */
    /*---------------------------------------------------*/    
    cancelReservation : function (){
        var objet = this;
        document.getElementById("cancelResa").addEventListener("click", function () {
            objet.cancelResa();
        });
    },

    /*---------------------------------------------------*/
    /* Annule la réservation                             */
    /*---------------------------------------------------*/ 
    cancelResa : function () {
        var timer = this.timer;
        timer.cancelResa(); 
        this.start();   
        this.setIcon(this.detailMarker);
        $("#cancelResa").hide();
    },

    /*---------------------------------------------------*/
    /* Slow effect scroll                                */
    /*---------------------------------------------------*/  
    slowEffect : function () {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });  
    },


    /*---------------------------------------------------*/
    /* Evénement clique qui permet d'actualiser la carte */
    /*---------------------------------------------------*/
    reloadMarker: function (){   
        document.getElementById("initMap").addEventListener("click" ,function (){
            this.addMarker();
        });
    },

};



            

