$(document).ready(function() {
	"use strict";


// ------------- Pre-loader--------------

// makes sure the whole site is loaded

$(window).load(function() {
    // will first fade out the loading animation
    $(".preloader").fadeOut();
    //then background color will fade out slowly
    $("#faceoff").delay(200).fadeOut("slow");
});

//-------Appearence of navigation----------

  $('header .nav').onePageNav({
    scrollThreshold: 0.2, // Adjust if Navigation highlights too early or too late
    scrollOffset: 90 //Height of Navigation Bar
  });


  //var winWidth = $(window).width();
  $(window).scroll(function() {
    //if (winWidth > 767) {
      var $scrollHeight = $(window).scrollTop();
      if ($scrollHeight > 600) {
        $('#home').slideDown(400);
      }else{
        $('#home').slideUp(400);
      }
    //}

	//got o top
	  if ($(this).scrollTop() > 200) {
			$('#go-to-top a').fadeIn('slow');
		  } else {
			$('#go-to-top a').fadeOut('slow');
	  }
  });

  //-------scroll to top---------

 $('#go-to-top a').click(function(){
	$("html,body").animate({ scrollTop: 0 }, 750);
	return false;
  });

//--------------- SmoothSroll--------------------

var scrollAnimationTime = 1200,
    scrollAnimation = 'easeInOutExpo';
$('a.scrollto').bind('click.smoothscroll', function (event) {
    event.preventDefault();
    var target = this.hash;
    $('html, body').stop().animate({
        'scrollTop': $(target).offset().top
    }, scrollAnimationTime, scrollAnimation, function () {
        window.location.hash = target;
    });
});

// ------------- Owl Carousel--------------

 $("#owl-demo").owlCarousel({
  navigation : true,
  slideSpeed : 300,
  pagination: false,
  autoPlay: 5000,
  items : 4,
  });

//--------------- for navigation---------------------

    $('.navbar-collapse ul li a').click(function() {
      $('.navbar-toggle:visible').click();
  });

//--------------- -Loading the map ------------------

 $(document).on('click','.contact-map',function(event){
	event.preventDefault();
	initialize();
 });

// ------------- Magnific--------------

    $('.test-popup-link').magnificPopup({
      type:'image',
      closeBtnInside:true,
      // Delay in milliseconds before popup is removed
      removalDelay: 300,

      // Class that is added to popup wrapper and background
      // make it unique to apply your CSS animations just to this exact popup
      mainClass: 'mfp-fade',
      gallery: {
          enabled: true, // set to true to enable gallery

          preload: [0,2], // read about this option in next Lazy-loading section

          navigateByImgClick: true,

          //arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>', // markup of an arrow button

          closeMarkup: '<button title="%title%" class="mfp-close"><i class="mfp-close-icn">&times;</i></button>',

          tPrev: 'Previous (Left arrow key)', // title for left button
          tNext: 'Next (Right arrow key)', // title for right button
          //tCounter: '<span class="mfp-counter">%curr% of %total%</span>' // markup of counter
        }
   });

// ------------------Carousel--------------

$('#myCarousel, #myCarousel2').carousel({
  interval: 4000,
  pause: "null"
})

//-----------Text Slider on Banner-----------

   $('.flex_text').flexslider({
        animation: "slide",
    selector: ".slides li",
    controlNav: false,
    directionNav: false,
    slideshowSpeed: 4000,
    touch: true,
    useCSS: false,
    direction: "vertical",
        before: function(slider){
     var height = $('.flex_text').find('.flex-viewport').innerHeight();
     $('.flex_text').find('li').css({ height: height + 'px' });
        }
    });

// ----------initializing the wow.js ---------

    // Animate and WOW Animation
    var wow = new WOW(
        {
            //offset: 50,
            mobile: false
           // live: true
        }
    );
    wow.init();


});


var fullScreenHome = function() {
    if(matchMedia( "(min-width: 992px) and (min-height: 500px)" ).matches) {
      "use strict"; //RUN JS IN STRICT MODE
    var height = $(window).height();
      contH = $(".banner .col-sm-12").height(),
      contH = $(".banner-carousel .col-sm-12").height(),
      contMT = (height / 2) - (contH / 2);
    $(".banner-carousel").css('min-height', height + "px");
    $(".trans-bg").css('min-height', height + "px");
    $(".banner .col-sm-12").css('margin-top', (contMT - 270) + "px");
    $(".banner-carousel .col-sm-12").css('margin-top', (contMT - 10) + "px");
  }
}

$(document).ready(fullScreenHome);
$(window).resize(fullScreenHome);
