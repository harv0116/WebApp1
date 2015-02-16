
var app = {
  name: "My App",
  version: "1.2.3",
  pages: [],
	numLinks: 0,
	numPages: 0,
	
  init: function(){
  	//add main listeners
		document.addEventListener("DOMContentLoaded", function(){
		//device ready listener
		pages = document.querySelectorAll('[data-role="page"]');	
		numPages = pages.length;
		var links = document.querySelectorAll('[data-role="pagelink"]');
		numLinks = links.length;
		for(var i=0;i<numLinks; i++){
			console.log( links[i] );
			links[i].addEventListener("click", handleNav, false);	
		}
		loadPage(null);
		
		 if( navigator.geolocation ){ 		  
			var params = {enableHighAccuracy: false, timeout:3600, maximumAge:60000};
			navigator.geolocation.watchPosition( reportPosition, gpsError, params ); 
		  }else{
			//browser does not support geolocation api
			alert("Sorry, your browser does not support location tools.")
		  }
		  
	});

	function handleNav(ev){
		ev.preventDefault();
		var href = ev.target.href;
		
		// sometimes this works but most of the time it does not.
		// usually the console error is 
		//
		// Uncaught TypeError: Cannot read property 'split' of undefined
		//
		// Basically handleNav is undefined - for some reason
		console.log(href);
		
		var parts = href.split("#");
		loadPage( parts[1] );	
	  return false;
	}
	
	function loadPage( url ){
		if(url == null){
			//home page first call
			pages[0].style.display = 'block';
			history.replaceState(null, null, "#home");	
		}else{
		//no longer on the home page... show the back
		document.querySelector('[data-rel="back"]').style.display = "block";
		
		for(var i=0; i < numPages; i++){
		  if(pages[i].id == url){
			pages[i].style.display = "block";
			history.pushState("#" + url);	
		  }else{
			pages[i].style.display = "none";	
		  }
		}
		}
	}
	
	//add Cordova Plugin listeners

	
	function reportPosition( position ){ 
	
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
	}
	
	function gpsError( error ){   
		var errors = {
			1: 'Permission denied',
			2: 'Position unavailable',
			3: 'Request timeout'
		};
		alert("Error: " + errors[error.code]);
	}
    
	},
  deviceReady: function( ){
	  
	  //put in here when ready to test on phone or simulator
	  
	  
	  
  	                 
  },
  domReady: function( ){
    //add listeners for pages, links, interface, etc
    //populate the pages array
	
	
	
    
  },
  somethingElse: function( ){
                      
  }
};

app.init();


// JavaScript Document



//Still need a listener for the popstate event to handle the back button
//Still need a listener for the back button in the header


