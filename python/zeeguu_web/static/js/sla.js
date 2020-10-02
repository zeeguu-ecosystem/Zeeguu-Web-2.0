function showStar(starred) {
    if (starred) {
        $("#star").html('<img src="/static/img/star.svg" alt="star"/>');
    } else {
        $("#star").html('<img src="/static/img/star_empty.svg" alt="star"/>');
    }
}


$(function () {


    $("#login").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 4
            }
        },

        errorClass: "help-inline",
        errorElement: "span",
        highlight: function (element, errorClass, validClass) {
            $(element).parents('.control-group').removeClass('success');
            $(element).parents('.control-group').addClass('error');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents('.control-group').removeClass('error');
            $(element).parents('.control-group').addClass('success');
        }
    });

    $("#login input[type=submit]").click(function () {
        return $("form").valid();
    });


    $("#create_account").validate({
        rules: {
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 4
            },
            name: {
                required: true
            }
        },

        errorClass: "help-inline",
        errorElement: "span",
        highlight: function (element, errorClass, validClass) {
            $(element).parents('.control-group').removeClass('success');
            $(element).parents('.control-group').addClass('error');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).parents('.control-group').removeClass('error');
            $(element).parents('.control-group').addClass('success');
        }
    });

    $("#create_account input[type=submit]").click(function () {
        return $("form").valid();
    });

});


function deleteBookmark(id) {
    console.log("deleting " + id);
    $.post("/delete_bookmark/" + id);
    $("#bookmark" + id).fadeOut();
    return false;
}


function reportCorrectMiniExercise(id) {
    console.log("Reporting correct mini exercise " + id);
    var bookmark_div = $("#bookmark" + id);
    bookmark_div.hide();
    $.post("/report_correct_mini_exercise/" + id);
    return false;
}


function unstarBookmark(id) {
    console.log("unstarring " + id)
    $.post("/unstarred_bookmark/" + id);
    $("#star" + id).html('<a href=\"javascript:void(0);\" onclick=\"starBookmark(' + id + ')\"><img src="/static/img/star_empty.svg" alt="star"/></a>');
}


function starBookmark(id) {
    console.log("starring " + id)
    $.post("/starred_bookmark/" + id);
    $("#star" + id).html('<a href=\"javascript:void(0);\" onclick=\"unstarBookmark(' + id + ')\"><img src="/static/img/star.svg" alt="star"/></a>');
}
