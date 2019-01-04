 /* --------------------------------------------*/
/* Section Canvas du programme                  */
/*---------------------------------------------*/


/* --------------------------------------------*/
/* Création de l'objet Canvas                  */
/*---------------------------------------------*/  

var objCanvas = {
    canvas : null,
    drawing : false,
    mousePos : { x:null, y:null },
    lastPos : { x:null, y:null },
    time : null,
    ctx : null,
        
    /* --------------------------------------------*/
    /* Initialisation de l'objet Canvas            */
    /*---------------------------------------------*/ 
    init : function (canvas,valid,clear) {  
        this.canvas = canvas;
        this.valid = valid;
        this.clear = clear;
        this.ctx = canvas.getContext("2d");  
        this.mouse();
        this.touch();
    },
         
    /* --------------------------------------------*/
    /* Requête d'actualisation                     */
    /*---------------------------------------------*/ 
    requestAnimFrame : function (callback) {
        this.time = window.setTimeout(callback, 3000/60/60, objet);  
        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    },
    
    stopAnimFrame : function ()
    {
        clearTimeout(this.time);
    },
    
    /* --------------------------------------------*/
    /* Evénements souris                           */
    /*---------------------------------------------*/  
    mouse : function () {
        canvas = this.canvas;
        objet = this;
        canvas.addEventListener("mousedown", function (e) {
            objet.drawing = true;
            objet.lastPos = objet.getMousePos(canvas, e);
            objet.drawLoop(objet);
        }, false);

        canvas.addEventListener("mouseup", function (e) {
            objet.drawing = false;
            objet.stopAnimFrame();
            $(valid).show();
            $(clear).show();   
        }, false);

        canvas.addEventListener("mousemove", function (e) {
            objet.mousePos = objet.getMousePos(canvas, e);            
        }, false);
    },
     
    /* --------------------------------------------*/
    /* Interprète la position de la souris         */
    /*---------------------------------------------*/      
	getMousePos : function (canvasDom, mouseEvent) {    
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: mouseEvent.clientX - rect.left,
            y: mouseEvent.clientY - rect.top
        };
	},

 
	/* ----------------------------------------------------------*/
    /* Dessine le canvas en fonction de la position de la souris */
    /*-----------------------------------------------------------*/ 
	renderCanvas : function () {
        var ctx = this.ctx;
        if (this.drawing === true) {
            ctx.moveTo(this.lastPos.x, this.lastPos.y);
            ctx.lineTo(this.mousePos.x, this.mousePos.y);
            ctx.lineWidth = 5;
            ctx.stroke();
            this.lastPos = this.mousePos;
        };
	},

    /* ----------------------------------------------------------*/
    /* nettoie le canvas                                         */
    /*-----------------------------------------------------------*/
	clearCanvas : function () {
        canvas.width = canvas.width;
	},

    /* ----------------------------------------------------------*/
    /* boucle la requète d'actualisation du canvas               */
    /*-----------------------------------------------------------*/
    drawLoop : function (objet) {
        objet.requestAnimFrame(objet.drawLoop);
        objet.renderCanvas();
    },
    
    
    /* --------------------------------------------*/
    /* Evenements Tactiles                         */
    /*---------------------------------------------*/    
    touch : function () {
        var canvas = this.canvas;
        var objet = this;

        canvas.addEventListener("touchstart", function (e) {
            objet.mousePos = objet.getTouchPos(canvas, e);
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousedown", {
                clientX: touch.clientX,
                clientY: touch.clientY,
            });
            objet.drawLoop(objet);
            canvas.dispatchEvent(mouseEvent);
        }, false);

        canvas.addEventListener("touchend", function (e) {
            var mouseEvent = new MouseEvent("mouseup", {});
            canvas.dispatchEvent(mouseEvent);
            objet.stopAnimFrame();
        }, false);

        canvas.addEventListener("touchmove", function (e) {
            var touch = e.touches[0];
            var mouseEvent = new MouseEvent("mousemove", {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            canvas.dispatchEvent(mouseEvent)
        }, false);
    },
      

    /* --------------------------------------------*/
    /* Interprète la position du doigt             */
    /*---------------------------------------------*/
    getTouchPos : function (canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
        };     
    },
};


	   
