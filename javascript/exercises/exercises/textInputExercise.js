/** Modular Zeeguu Powered Text Input Exercise @author Martin Avagyan, Sibren van Vliet
 *  @initialize it using: new TextInputExercise();
 *  @customize it by using prototypal inheritance
 **/

import $ from 'jquery';
import Exercise from './exercise';
import Util from '../util';
import Settings from "../settings";
import removeAccents from 'remove-accents';

var TextInputExercise = function (data, index, size) {
    this.init(data, index, size);
    //TODO unbind method
};

TextInputExercise.prototype = Object.create(Exercise.prototype, {
    constructor: TextInputExercise,
    /************************** SETTINGS ********************************/
});


TextInputExercise.prototype.cacheCustomDom = function () {
    this.$to = this.$elem.find("#ex-to");
    this.$context = this.$elem.find("#ex-context");
    this.$input = this.$elem.find("#ex-main-input");
    this.$showSolution = this.$elem.find("#show_solution");
    this.$checkAnswer = this.$elem.find("#check_answer");
    this.$clickableText = this.$elem.find(".clickable-text");
    this.$nextExercise = this.$elem.find('#next-exercise');
    this.$feedbackBtn = this.$elem.find('#feedback');
    this.$typoInformation = this.$elem.find("#typo-information");
};

TextInputExercise.prototype.giveHint = function () {
    // Reveal X letters of the answer, where X is the number of times the Hint button was clicked.
    var hint = this.answer.slice(0, this.hintsUsed);

    // Add dots after the revealed letters, to show how long the answer is.
    var hintWithDots = hint;
    for (var i = hint.length; i < this.answer.length; i++) {
        var character = this.answer.charAt(i);

        // Display spaces as spaces, not as dots
        if (character === ' ') {
            hintWithDots += character;
        } else {
            hintWithDots += '.';
        }
    }

    this.$input.val("").attr("placeholder", "Hint: " + hintWithDots).focus();
};

TextInputExercise.prototype.wrongAnswerAnimation = function () {
    this.shake.shakeElement(this.$input);
};

/**
 * Formats the string for comparing
 * @param {String}, text, to be formatted
 * @return {String}, the formatted string
 * removes numbers and symbols, multiple space, tabs, new lines are replaced by single space
 * */
TextInputExercise.prototype.formatStringForCheck = function (text) {
    return text.trim().toUpperCase().replace(/[^a-zA-Z ]/g, "").replace(/\s\s+/g, ' ');
};

TextInputExercise.prototype.successCondition = function () {
    this.answerWithTyposMarked = this.answer.trim().replace(/\s\s+/g, ' ');
    var input = this.$input.val().trim().toUpperCase().replace(/\s\s+/g, ' ');
    input = input.replace(/[\,;.]/g, '');
    var answer = this.answer.trim().toUpperCase().replace(/\s\s+/g, ' ');

    // Check exact match
    if (input === answer) {
        this.answerWithTyposMarked = this.answerWithTyposMarked.fontcolor(this.colourOrange);
        this.typoInformation = "";
        return true;
    }

    // Check exact match after removing accents
    if (removeAccents(input) === removeAccents(answer)) {
        // Mark typos
        var markedTypos = "";
        for (var i = 0; i < answer.length; i++) {
            if (input.charAt(i) !== answer.charAt(i)) {
                markedTypos += this.answerWithTyposMarked.charAt(i).fontcolor("#6D6D6D");
            } else {
                markedTypos += this.answerWithTyposMarked.charAt(i).fontcolor(this.colourOrange);
            }
        }

        this.answerWithTyposMarked = markedTypos;
        this.typoInformation = "Pay close attention to the accents!";
        return true;
    }

    // No checks were successful
    return false;
};

export default TextInputExercise;