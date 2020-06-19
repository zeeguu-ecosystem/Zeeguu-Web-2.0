/**
 * The class responsible for sending a feedback regarding exercise outcome
 */
import * as Mustache from "mustache";
import $ from "jquery";
import Settings from "./settings";

export default class Feedback {

    /**
     * Construct the feedback class
     * @param {number}, id of the current word
     * @param {String}, resultSubmitSource,
		 * @param {function}, function to be called back after successful feedback,
		 * @param {this}, scope of callback function,
     * */
    constructor(resultSubmitSource, sessionId, callback, parentScope) {
        /** Class parameters*/
        this.wordId = -1;//will be set whenever the feedback box is called
        this.resultSubmitSource = resultSubmitSource;
        this.sessionId = sessionId;
        this.callback = callback;
        this.parentScope = parentScope;
    }

    /**
     * Bind all the actions connected to this module
     * return {void}
     * */
    bindUIActions() {
        //Bind UI action of credits to the function
        $('.btn-feedback-option').click((event) => { this.feedbackAction($(event.target)); });
    }

    /**
     * The action performed predefined option is clicked
     * @param {Object}, elem, the element that is clicked
     * */
    feedbackAction(elem) {
        this.submitFeedback(this.wordId, elem.attr('value'), this.resultSubmitSource);
        this.successfulFeedback();

    }

    /**
     * @param {number}, session id
     * @param {String}, resultSubmitSource,
     * */
    exerciseFeedbackBox(wordId) {
        let _this = this;
        this.wordId = wordId;
        let feedbackOptions = this.exerciseFeedbackOptions();
        let inputBox = this.exerciseFeedbackInput();
        swal({
            title: "",
            text: feedbackOptions + inputBox,
            showCancelButton: true,
            showConfirmButton: false,
            animation: "slide-from-top",
            imageUrl: "static/img/svg/elephant_yellow.svg",
            imageSize: "110x110",
            allowOutsideClick: true,
            html: true
        },
            function () {
                let inputValue = $('#feedback-input-box').val().trim();
                if (inputValue != "") {
                    _this.submitFeedback(wordId, inputValue, _this.resultSubmitSource);
                    _this.successfulFeedback();
                    return;
                }
                swal.close();
            });
        this.bindUIActions();
    }

    /**
     * Display success message when the feedback is being submitted
		 * and go to next exercise.
     * */
    successfulFeedback() {
        swal({
            title: "",
            text: "",
            timer: 1000,
            type: "success",
            showConfirmButton: false,
            showCancelButton: false,
            closeOnConfirm: false,
        });
        this.callback.call(this.parentScope);
    }

    /**
     * Feedback fields for the feedback box within the exercise
     * Using html template and Mustache to render the content
     * @return {String} rendered html
     * */
    exerciseFeedbackOptions() {
        let preDefinedOptions = {
            Options: [
                { name: "Too Easy", val: 'too_easy' },
                { name: "Too Hard", val: 'too_hard' },
                { name: "Wrong Example", val: 'wrong_example' },
                { name: "Bad Translation", val: 'bad_translation' },
                { name: "Not a Good Example", val: 'not_a_good_example' }]
        };
        let preOptionTemplate =
            '{{#Options}}' +
            '<div type = "button" value = {{val}} class = "btn btn-standard btn-feedback-option">' +
            '<div class = "emoji-icon"  value = {{val}} style = "background-image: url({{icon}});" ></div>' +
            '<span value = {{val}}>{{name}}</span>' +
            '</div>' +
            '{{/Options}}';
        return (Mustache.render(preOptionTemplate, preDefinedOptions));
    }

    /**
     * Returns the input box for the feedback
     * @return {String}, the input box for the feedback
     * */
    exerciseFeedbackInput() {
        return '<div class="input-group feedback-input">' +
            '<input type="text" class="form-control" id = "feedback-input-box" placeholder="Something else ?">' +
            '</div>';
    }

    /**
     *	Request the submit for feedback to the Zeeguu API
     *  @param {number}, id, id of the word
     *  @param {String}, feedbackOption, the outcome of the feedback @example: too_easy
     *  @param {String}, resultSubmitSource, the source of submission @example: Recognize_L1W_in_L2T
     **/
    submitFeedback(wordID, feedbackOption, resultSubmitSource) {
        //console.log(Settings.ZEEGUU_API + Settings.ZEEGUU_EX_OUTCOME_ENDPOINT + "/" + feedbackOption + resultSubmitSource + "/" + -1 + "/" + wordID + "?session="+this.sessionId);
        $.post(Settings.ZEEGUU_API + Settings.ZEEGUU_EX_OUTCOME_ENDPOINT + "/" + feedbackOption + resultSubmitSource + "/" + -1 + "/" + wordID + "?session=" + this.sessionId);
    }
}