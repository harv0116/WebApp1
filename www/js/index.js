
var app = {
  	name: "My App",
  	version: "1.2.3",
  	pages: [],
	links: [],
	numLinks: 0,
	numPages: 0,
	pageTime: 500,
	pageshow: document.createEvent("CustomEvent"),
	
    initialize: function() {
        this.bindEvents();
    },

    bindEvents: function() {
        app.pageshow.initEvent("pageShow", false, true);
		document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
	
		if( app.detectTouchSupport ){
		//we have support for touch events in the browser
			console.log ("browser supports touch events");
		//add the event listeners for the touch events here.
		}else{
		//add the click listeners to the same objects	
		}
		
		app.pages = document.querySelectorAll('[data-role="page"]');	
		app.numPages = app.pages.length;
		app.links = document.querySelectorAll('[data-role="pagelink"]');
		app.numLinks = app.links.length;
		
		

		for(var i=0;i<app.numLinks; i++)
		{
			app.links[i].addEventListener("touchend", app.touchHandler, false);
			//app.links[i].addEventListener("click", app.handleNav, false);	
		}
		
		for(var p=0; p < app.numPages; p++){
    		app.pages[p].addEventListener("pageShow", app.handlePageShow, false);
  		}
		

		
		app.loadPage(null);
		
	 
  	},

	handleNav: function(ev){
		ev.preventDefault();
		var href = ev.target.href;
		var parts = href.split("#");
		app.loadPage( parts[1] );	
	  	return false;
  	},
	handlePageShow: function(ev){
  		ev.target.className = "active";
		
		if (ev.currentTarget.id == "contact") 
		{
			var options = new ContactFindOptions();
			options.filter = "";
			options.multiple = true;
			var fields = ["displayName"]; 
			navigator.contacts.find(fields, app.successFunc, app.errFunc, options);	
		} else if (ev.currentTarget.id == "geo") {
			if( navigator.geolocation ){ 		  
				var params = {enableHighAccuracy: true, timeout:9000, maximumAge:5000};
				navigator.geolocation.getCurrentPosition( app.reportPosition, app.gpsError, params ); 
			}else{
				alert("Sorry, your browser does not support location tools.");
			}	
		}
	},
  	loadPage: function(url){
		if(url == null){
		//home page first call
		app.pages[0].className = 'active';
		history.replaceState(null, null, "#home");
			
		}else{
			for(var i=0; i < app.numPages; i++){
			  app.pages[i].className = "hidden";
			  //get rid of all the hidden classes
			  //but make them display block to enable anim.
			  if(app.pages[i].id == url){
				app.pages[i].className = "show";
				//add active to the proper page
				history.pushState(null, null, "#" + url);
				setTimeout(app.addDispatch, 50, i);
			  }
			}
			//set the activetab class on the nav menu
			for(var t=0; t < app.numLinks; t++){
			  app.links[t].className = "";
			  if(app.links[t].href == location.href){
				app.links[t].className = "activetab";
			  }
			}
		}
  	},
	addDispatch: function(num){
  		app.pages[num].dispatchEvent(app.pageshow);
	},
  	reportPosition: function(position){
		var width = 300;
		var height = 300;
		var can = document.createElement("canvas");
		can.className = "myCanvas";
		can.setAttribute("width", width); 
		can.setAttribute("height", height); 
		document.getElementById('output').appendChild(can);
	  
		var canvasRef = document.querySelector('.myCanvas');
		var context = canvasRef.getContext('2d');
		var img = new Image;
	
		img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + 
		position.coords.latitude+ "," + position.coords.longitude + 
		"&markers=color:red%7Xlabel:X%7C" + position.coords.latitude + 
		"," + position.coords.longitude +
		 " &size=300x300&zoom=14&key=AIzaSyB0kyumQiko8guSTwwT7rUweHYqSxXV5Vw";
	  
		img.onload = function() {
			context.drawImage(img, 0, 0);
	  	};
	},
  	gpsError: function( error ){	   
		var errors = {
			1: 'Permission denied',
			2: 'Position unavailable',
			3: 'Request timeout'
		};
		alert("Error: " + errors[error.code]);
  	},
	successFunc: function( matches ){
		var randomNum = app.getRandomInt(0,matches.length);
		 
		var div = document.getElementById("displaycontact");
		var namep = document.createElement("p");
		var phone1p = document.createElement("p");
		var phone2p = document.createElement("p");
		var hr = document.createElement("hr");
		
		namep.innerHTML = matches[randomNum].displayName;
		
		for (var j=0; j<matches[randomNum].phoneNumbers.length; j++) 
		{
		 	if (j==0) {
				phone1p.innerHTML = 	
				matches[randomNum].phoneNumbers[j].type + ": " + 
				matches[randomNum].phoneNumbers[j].value;
			} else {
				phone2p.innerHTML = 
				matches[randomNum].phoneNumbers[j].type + ": " + 
				matches[randomNum].phoneNumbers[j].value;
			}
		}
		div.appendChild(namep);
		div.appendChild(phone1p);
		div.appendChild(phone2p);
		div.appendChild(hr);	  
	},
	errFunc: function ( ) {
		alert("The contact could not be found");
	},
	getRandomInt: function (min, max) {
  		return Math.floor(Math.random() * (max - min)) + min;
	},
	detectTouchSupport: function( ){
		msGesture = navigator && navigator.msPointerEnabled && navigator.msMaxTouchPoints > 0 && MSGesture;
		var touchSupport = (("ontouchstart" in window) || msGesture || (window.DocumentTouch && document instanceof DocumentTouch));
		return touchSupport;
	},
	
	touchHandler: function(ev){
    //this function will run when the touch events happen
		if( ev.type == "touchend"){
		ev.preventDefault();
		var touch = ev.changedTouches[0];        //this is the first object touched
		
		var newEvt = document.createEvent("MouseEvent");	//old method works across browsers, though it is deprecated.
		/**
		event.initMouseEvent(type, canBubble, cancelable, view,
						 detail, screenX, screenY, clientX, clientY,
						 ctrlKey, altKey, shiftKey, metaKey,
						 button, relatedTarget); **/
		newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
		//var newEvt = new MouseEvent("click");				//new method
		//REF: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.MouseEvent
		ev.currentTarget.dispatchEvent(newEvt);
		//change the touchend event into a click event and dispatch it immediately
		//this will skip the built-in 300ms delay before the click is fired by the browser
		app.handleNav(ev);
		}
}
};
app.initialize();


