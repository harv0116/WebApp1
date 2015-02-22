
var app = {
  	name: "My App",
  	version: "1.2.3",
  	pages: [],
	links: [],
	numLinks: 0,
	numPages: 0,
	pageTime: 800,
	pageshow: document.createEvent("CustomEvent"),
	
	
  	init: function(){
  	//add main listeners		
		
		app.pageshow.initEvent("pageShow", false, true);
		document.addEventListener("DOMContentLoaded", this.deviceReady);
	},
  	domReady: function( ){
	  //put in here when ready to test on phone or simulator	                 
  	},
  	deviceReady: function( ){
		//add listeners for pages, links, interface, etc
		//populate the pages array
		app.pages = document.querySelectorAll('[data-role="page"]');	
		app.numPages = app.pages.length;
		app.links = document.querySelectorAll('[data-role="pagelink"]');
		app.numLinks = app.links.length;
		for(var i=0;i<app.numLinks; i++){
			//console.log( app.links[i] );
			app.links[i].addEventListener("click", app.handleNav, false);	
		}
		for(var p=0; p < app.numPages; p++){
    		app.pages[p].addEventListener("pageShow", app.handlePageShow, false);
  		}
		app.loadPage(null);
		
		if( navigator.geolocation ){ 		  
			var params = {enableHighAccuracy: false, timeout:3600, maximumAge:60000};
			navigator.geolocation.watchPosition( app.reportPosition, app.gpsError, params ); 
		}else{
			//browser does not support geolocation api
			alert("Sorry, your browser does not support location tools.");
		}
		
		document.addEventListener("scroll", app.handleScrolling, false);
		
		var options = new ContactFindOptions( );
		options.filter = "";  //leaving this empty will find return all contacts
		options.multiple = true;  //return multiple results
		var fields = ["displayName"];    //an array of fields to compare against the options.filter 
		navigator.contacts.find(fields, app.successFunc, app.errFunc, options);
		  
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
  		//num is the value i from the setTimeout call
  		//using the value here is creating a closure
	},
  	reportPosition: function(position){
		var width = 400;
		var height = 400;
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
		 " &size=400x400&zoom=14&key=AIzaSyB0kyumQiko8guSTwwT7rUweHYqSxXV5Vw";
	  
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
		// this should give me a count of all the contacts and have their id #s 
		// for which I can do a search on later to get a specific contact
			alert("GOT HERE");
		  for( var i=0; i<matches.length; i++){
			document.getElementById('displaycontact').appendChild(matches[i].displayName);
			
		  }
	},
	errFunc: function ( ) {
		alert("The contact could not be found");
	},
 	handleScrolling: function (ev){
 		var height = window.innerHeight;
 		var offset = window.pageYOffset;
  		var footHeight = 60;
  		var footer = document.querySelector("#sticky");
  		footer.style.position = "absolute";
  		var total = height + offset - footHeight;
  		footer.style.top = total + "px";
	}
};

app.init();
//Still need a listener for the popstate event to handle the back button
//Still need a listener for the back button in the header


