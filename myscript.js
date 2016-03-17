(function () {

	var HEIGHT = window.innerHeight;
	var WIDTH = window.innerWidth;
	var HEADEROFFSET = 50;

	// Initialization DOM is ready
	document.addEventListener("DOMContentLoaded", function() {
		var body = document.querySelector("body");
		body.setAttribute("class", "init");
		mainSetup();
		menuSetup();
		body.className = "";
	})

	// Document scrolling freatures
	document.addEventListener("scroll", function(event) {
		var notAtTop = window.pageYOffset;
		var header = document.querySelector("#header");

		// Header box-shadow
		if (notAtTop) {
			header.style.boxShadow = "0 0 4px 4px rgba(0, 0, 0, 0.4)";
		} else {
			header.style.boxShadow = "none";
		}
	})

	// Window resizing
	window.addEventListener("resize", function() {
		mainSetup();
	})

	// Helper functions
	// Main page setup
	function mainSetup() {
		HEIGHT = window.innerHeight;

		var main = document.getElementById("main");
		main.style.height = HEIGHT - HEADEROFFSET + "px";

		var about = document.querySelector("#about");
		var aboutPos = about.offsetTop - HEADEROFFSET;
		about.children[0].classList.remove("bounce");

		main.addEventListener("click", function(event) {
			smoothScroll(window.scrollY, aboutPos);
			about.children[0].classList.add("bounce");
		})
	}

	// Menu setup
	function menuSetup() {
		var menu = document.querySelectorAll("#header-list li");
		var item, goToItem, goToItemPos;
		for (var i = 0; i < menu.length; i++) {
			item = menu[i]
			switch(item.textContent) {
				case "ABOUT":
					item.addEventListener("click", function(){
						goToItem = document.querySelector("#about");
						goToItemPos = goToItem.offsetTop - HEADEROFFSET;
						smoothScroll(window.scrollY, goToItemPos);
						console.log(goToItem.children[0].classList.add("bounce"));
					});
					break;
				case "WHATICANDO":
					item.addEventListener("click", function(){
						goToItem = document.querySelector("#whaticando");
						goToItemPos = goToItem.offsetTop - HEADEROFFSET;
						console.log(goToItemPos);
						smoothScroll(window.scrollY, goToItemPos);
					});
					break;
				case "CODE":
					item.addEventListener("click", function(){
						goToItem = document.querySelector("#code");
						goToItemPos = goToItem.offsetTop - HEADEROFFSET;
						smoothScroll(window.scrollY, goToItemPos);
					});
					break;
				case "CONTACT":
					item.addEventListener("click", function(){
						goToItem = document.querySelector("#contact");
						goToItemPos = goToItem.offsetTop - HEADEROFFSET;
						smoothScroll(window.scrollY, goToItemPos);
					});
					break;
				default:
			}
		}
	}

	// Smooth scroll
	function smoothScroll(begin, end) {
		if (begin < end) scrollDown(begin, end);
		else scrollUp(begin, end);
	}
	function scrollDown(begin, end) {
		if (begin < end) {
			if (begin + 15 >= end) {
				setTimeout(function(){
					window.scrollTo(0, begin + 1);
					smoothScroll(begin+1, end);
				}, 1)
			} else {
				setTimeout(function(){
					window.scrollTo(0, begin + 15);
					smoothScroll(begin+15, end);
				}, 1)
			}
		}
	}
	function scrollUp(begin, end) {
		if (begin > end) {
			if (begin - 15 <= end) {
				setTimeout(function(){
					window.scrollTo(0, begin - 1);
					smoothScroll(begin-1, end);
				}, 1)
			} else {
				setTimeout(function(){
					window.scrollTo(0, begin - 15);
					smoothScroll(begin-15, end);
				}, 1)
			}
		}
	}

})();