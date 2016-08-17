(function ($, Drupal, window, document, undefined) {
  // Checks that selector exists.
  $.fn.exists = function (){
    return this.length>0;
  };

  Drupal.behaviors.affixHeader = {
    attach: function (context, settings) {
      // Navbar.
      var navbar = $('#navbar');

      // Applies max-height CSS styles to navbar menu to make it gracefully scrollable for mobile phones.
      var apply_navbar_menu_max_height = function () {
        navbar.find('.navbar-collapse').css('max-height', $(window).height() - navbar.outerHeight());
        navbar.find('.navbar-collapse .expand-wrapper-outer').css('max-height', $(window).height() - navbar.outerHeight() - $('.region-region-page-top').outerHeight());
      };
      // Applies top CSS styles to navbar.
      var apply_navbar_top = function () {
        navbar.css("top", offset_target.outerHeight());
      };
      // Applies affix on load.
      var apply_affix_load = function () {
        navbar.affix({offset: {top: offset_target.outerHeight()} });
      };
      // Reapplies affix on resize.
      var apply_affix_resize = function () {
        navbar.data('bs.affix').options.offset.top = offset_target.outerHeight();
      };

      // Add class to the entire #navbar on it's navbar-collapse being collapsed.
      $(window).load(function () {
        navbar.find('.navbar-collapse').on('shown.bs.collapse', function() {
          navbar.addClass('with-collapsed-menu');
        });
        navbar.find('.navbar-collapse').on('hidden.bs.collapse', function() {
          navbar.removeClass('with-collapsed-menu');
        });
      });

      // Stick header to the top of screen with Dynamic offset = region_page_top height.
      var offset_target = $('.region-region-page-top');

      $(window).load(function () {
        apply_affix_load();
        apply_navbar_top();
        apply_navbar_menu_max_height();
      });
      $(window).resize(function () {
        apply_affix_resize();
        apply_navbar_top();
        apply_navbar_menu_max_height();
      });

      // Hide/show header on scroll top/down.
      var lastScrollTop = 0;
      $(window).scroll(function () {
        var st = $(this).scrollTop();
        if (st < lastScrollTop) {
          // Scrolled Up.
          navbar.show();
        } else if (st > lastScrollTop) {
          // If we are on mobile resolution and we have at least one navbar submenu open - don't hide it.
          if (($(window).width() > '768' || !navbar.find("li.dropdown.open").exists()) && navbar.hasClass("affix")) {
            // Scrolled Down.
            navbar.hide();
            // Close all opened menus.
            navbar.find("li.expanded.open").each(function () {
              $(this).removeClass("open");
            });
            // Close all opened mobile menus.
            navbar.find(".navbar-collapse.in").each(function () {
              $(this).removeClass("in");
              $(this).addClass("collapse");
            });
          }
        }
        lastScrollTop = st;
      });
    }
  };

})(jQuery, Drupal, this, this.document);