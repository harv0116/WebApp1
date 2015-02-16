
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
			//console.log( links[i] );
			links[i].addEventListener("click", handleNav, false);	
		}
		loadPage(null);
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

  
	},
  deviceReady: function( ){
  	//add Cordova Plugin listeners
                      
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

