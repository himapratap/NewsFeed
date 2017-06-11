$(document).ready(function() {

    $(".comments").hide();

    $.get("/showComments", function(req, res) {
      $(".comments").show();

    })

     
});
