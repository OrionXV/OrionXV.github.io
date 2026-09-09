// Scroll local section links below the fixed navigation bar.
$(document).ready(function () {
    $('a').on('click', function (event) {
        if (!this.hash || $(this).hasClass('no-scroll') ||
            this.origin !== window.location.origin || this.pathname !== window.location.pathname) return;
        var target = document.getElementById(decodeURIComponent(this.hash.slice(1)));
        if (!target) return;
        event.preventDefault();
        if ($(this).closest('.navbar').length) {
            var menu = $('#navbarSupportedContent');
            if (menu.hasClass('collapsing')) {
                menu.one('shown.bs.collapse', function () { menu.collapse('hide'); });
            } else {
                menu.collapse('hide');
            }
        }
        var hash = this.hash;
        var duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 400;
        $('html, body').stop().animate({
            scrollTop: Math.max(0, $(target).offset().top - 110)
        }, duration, function () {
            window.history.replaceState(null, '', hash);
        });
    });
});

  
// portfolio carousel
function labelProjectPages(event) {
    $(event.target).find('.owl-dot').each(function (index) {
        $(this).attr('aria-label', 'Project page ' + (index + 1));
    });
}

$('#owl-portfolio').owlCarousel({
    onInitialized: labelProjectPages,
    onRefreshed: labelProjectPages,
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
