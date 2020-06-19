/**
 * Created by mircea on 09/06/15.
 */

function change_answer_bg_to_white() {
    $("#answer").css({backgroundColor: "white"});
}


function log_new_exercise(outcome) {
    url = ["/gym/create_new_exercise",
        outcome,
         $("#exercise_source").val(),
        -1,
        $("#bookmark_id").val()
        ].join("/");
     $.post(url, function(data) {

     });
}

function iKnowThis() {
    log_new_exercise("Too easy");
}

function answerIsCorrect(answer, reference) {
    return answer.toLowerCase().trim() == reference.toLowerCase().trim();
}

function checkAnswer() {

    if ($("#answer").val() == "") return;

    if (answerIsCorrect($("#answer").val(), $("#expected_answer").val())) {
        log_new_exercise("Correct");

        $("#check_answer").hide();
        $("#next_exercise").show().focus().select();

        $("#show_solution").hide();
        $("#i_learned_this").show();

        $("#correct_message").show();

        $("#answer").css("color", "green");


    } else {
        console.log("checking answer...");
        log_new_exercise("Wrong");
        $("#answer").css({backgroundColor: "#ffdddd"});
        setTimeout(change_answer_bg_to_white, 345);
    }
}

function showAnswer() {
    $("#answer").hide();
    $("#expected_answer").show();

    $("#check_answer").hide();
    $("#next_exercise").show();
    //$("#show_solution").hide();

    log_new_exercise("Show solution");
    $("#next_exercise").show().focus().select();

}


