// Custom initialization for home page - only what's needed
(function() {
    "use strict";
    
    // Wait for jQuery to be available
    function initWhenReady() {
        if (typeof jQuery === 'undefined') {
            console.log('Waiting for jQuery...');
            setTimeout(initWhenReady, 100);
            return;
        }
        
        var $ = jQuery;
        console.log('jQuery loaded, version:', $.fn.jquery);
        
        $(document).ready(function() {
            console.log('DOM ready, initializing home page...');
            
            // Initialize Revolution Slider
            if (typeof $.fn.revolution === 'function') {
                try {
                    var $slider = $('.minfullwidth');
                    if ($slider.length > 0) {
                        console.log('Initializing Revolution Slider...');
                        $slider.show().revolution({
                            delay: 15000,
                            dottedOverlay: "none",
                            startwidth: 1170,
                            startheight: 650,
                            hideThumbs: 10,
                            fullWidth: "on",
                            navigationType: "bullet",
                            navigationArrows: "solo",
                            navigationStyle: "none",
                            touchenabled: "on",
                            onHoverStop: "on",
                            navigationHAlign: "center",
                            navigationVAlign: "bottom",
                            navigationHOffset: 0,
                            navigationVOffset: 35,
                            fullScreenOffsetContainer: ""
                        });
                        console.log('Revolution Slider initialized successfully');
                    }
                } catch(e) {
                    console.error('Revolution Slider error:', e);
                }
            } else {
                console.warn('Revolution Slider plugin not available');
            }
            
            // Initialize Isotope for product filtering if available
            if (typeof $.fn.isotope === 'function') {
                try {
                    var $container = $('.dima-isotope-container');
                    if ($container.length) {
                        console.log('Initializing Isotope...');
                        $container.isotope({
                            itemSelector: '.isotope-item',
                            layoutMode: 'fitRows'
                        });
                        
                        // Filter items on button click
                        $('.filters').on('click', 'a', function(e) {
                            e.preventDefault();
                            var filterValue = $(this).attr('data-filter');
                            $container.isotope({ filter: filterValue });
                            $('.filters a').removeClass('active');
                            $(this).addClass('active');
                        });
                    }
                } catch(e) {
                    console.error('Isotope error:', e);
                }
            }
            
            // Initialize Magnific Popup for product quick view if available
            if (typeof $.fn.magnificPopup === 'function') {
                try {
                    $('[data-lightbox="ajax"]').magnificPopup({
                        type: 'ajax',
                        closeOnContentClick: false,
                        closeOnBgClick: true,
                        showCloseBtn: true,
                        enableEscapeKey: true
                    });
                } catch(e) {
                    console.error('Magnific Popup error:', e);
                }
            }
            
            // Mobile menu toggle
            $('.dima-btn-nav').on('click', function(e) {
                e.preventDefault();
                $('nav').toggleClass('active');
                $(this).toggleClass('active');
            });
            
            // Search box toggle
            $('.search-btn').on('click', function(e) {
                e.preventDefault();
                $('#search-box').toggleClass('active');
            });
            
            $('#close, #search-box').on('click', function(e) {
                if (e.target === this) {
                    $('#search-box').removeClass('active');
                }
            });
            
            // Submenu hover (desktop)
            if ($(window).width() > 768) {
                $('.menu-item-has-children').hover(
                    function() {
                        $(this).addClass('dima-hover');
                    },
                    function() {
                        $(this).removeClass('dima-hover');
                    }
                );
            }
            
            // Remove loading screen
            setTimeout(function() {
                $('.dima-loading').fadeOut();
            }, 500);
            
            console.log('Home page initialization complete');
        });
    }
    
    // Start initialization
    initWhenReady();
    
})();
