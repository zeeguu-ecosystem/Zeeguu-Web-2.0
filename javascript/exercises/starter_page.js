import $ from 'jquery';
/** STYLING for adding details while hovering */
if $('html').hasClass('no-touch')){
    $(document).ready(function () {
      $(".starter-btn-header-level1").hover(
        function () {
          console.log("HELLO")
          $(".words").css("display", "block");
          $(".info").css("display", "block");
        },
        function () {
          $(".words").css("display", "none");
          $(".info").css("display", "none");
        }
      );
    });
  } 
