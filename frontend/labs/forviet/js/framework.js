(function($) {
    'use strict';
    let MysticFramework = (function() {
        function init() {
            setActiveMenuItem();
            customToggleActions();
            tooltipsInit();
        }

        $(window).on('load', function() {
            $('#preloader-wrap').addClass('loaded');
        });

        function setActiveMenuItem() {
            let current = location.pathname.split("/").slice(-1)[0].replace(/^\/|\/$/g, '');
            $('.ms-main-aside .menu-item a', $('#ms-side-nav')).each(function() {
                let $this = $(this);
                if (current === "" || current === "index.html") {
                    if ($this.attr('href').indexOf("index.html") !== -1) {
                        $(this).addClass('active');
                        $(this).parents('.collapse').prev().addClass('active');
                        if ($(this).parents('.collapse').length) {
                            $(this).closest('.collapse').addClass('show');
                        }
                    }
                } else {
                    if ($this.attr('href').indexOf(current) !== -1) {
                        $(this).addClass('active');
                        $(this).parents('.collapse').prev().addClass('active');
                        if ($(this).parents('.collapse').length) {
                            $(this).closest('.collapse').addClass('show');
                        }
                    }
                }
            });
        }

        function customToggleActions() {
            $(document).on('click', '.ms-toggler', function() {
                let target = $(this).data('target');
                let toggleType = $(this).data('toggle');
                switch (toggleType) {
                    case 'slideLeft':
                        $(target).toggleClass('ms-aside-open');
                        $(".ms-aside-overlay.ms-overlay-left").toggleClass('d-block');
                        $("body").toggleClass('ms-aside-left-open');
                        break;
                    case 'slideDown':
                        $(target).toggleClass('ms-slide-down');
                        break;
                    default:
                        return;
                }
            });
        }

        function tooltipsInit() {
            $('body').tooltip({
                selector: '[data-toggle="tooltip"]',
                trigger: 'hover',
                template: '<div class="tooltip" role="tooltip"><div class="tooltip-inner"></div></div>'
            });
        }

        return {
            init: init
        }
    })();
    MysticFramework.init();
})(jQuery);