// Scroll local section links below the fixed navigation bar.
$(document).ready(function () {
    $('a').on('click', function (event) {
        if (!this.hash || $(this).hasClass('no-scroll') ||
            this.origin !== window.location.origin || this.pathname !== window.location.pathname) return;
        var target = document.getElementById(decodeURIComponent(this.hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        var hash = this.hash;
        $('html, body').stop().animate({
            scrollTop: Math.max(0, $(target).offset().top - 110)
        }, 400, function () {
            window.history.replaceState(null, '', hash);
        });
    });
});

  
// portfolio carousel
$('#owl-portfolio').owlCarousel({
    margin:30,
    dots: true,
    nav: true,
    navText: ['<span aria-label="Previous projects">←</span>', '<span aria-label="Next projects">→</span>'],
    responsiveClass:true,
    responsive:{
        0:{
            items:1,
            nav:true
        },
        600:{
            items:3,
            nav:true
        },
        1000:{
            items:4,
            nav:true,
            loop:false
        }
    }
});

// testmonial carousel
$('#owl-testmonial').owlCarousel({
    center: true,
    items:1,
    loop:true,
    nav: true,
    dots: false
})
