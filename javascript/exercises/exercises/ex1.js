/** Custom exercise form finding word in a context. Inherited from Exercise.js
 *  @initialize it using: new Ex1();
 *  @customize it by using prototypal inheritance 
**/

import $ from 'jquery';
import TextInputExercise from './textInputExercise';
import Util from '../util';
import Settings from "../settings";

function Ex1(data,index,size){
	this.init(data,index,size);
	
	/** @Override */
	this.bindUIActions = function(){
		//Bind UI action of Hint/Show solution to the function		
		this.$showSolution.on("click", this.handleHint.bind(this));
		
		//Bind UI action of Check answer to the function
		this.$checkAnswer.on("click", this.checkAnswer.bind(this));
		
		//Bind UI Text click		
		this.$clickableText.on("click",this.updateInput.bind(this));
		
		// Bind UI Enter Key
		this.$input.keyup(this.enterKeyup.bind(this));

		//Next exercise clicked
		this.$nextExercise.on("click",this.onRenderNextEx.bind(this));
		
		//Feedback for the previous bookmark: this.index
		this.$feedbackBtn.click(() => {this.giveFeedbackBox(this.index);});
	};
	
	/** @Override */
	this.next = function (){
		this.$to.html(this.data[this.index].to);
		this.$context.html(this.data[this.index].context);
		this.$input.val("").attr("placeholder", "Type or click a word");
		this.reStyleDom();
		this.answer = this.data[this.index].from;
		this.$descriptionContainer.removeClass('hide');
		this.$typoInformation.html("");
		
		if (!this.isMobile()) {
			this.$input.val("").focus();
		}
	};
	
	this.updateInput = function() {
		var t = Util.getSelectedText();
		this.$input.val(this.$input.val().trim() + " " + t);
	};
	
	// Re-print the context on screen, with the solution
	// highlighted in boldface and orange colour.
	this.reGenerateContext = function(inputWord){
		var contextString = this.data[this.index].context;
		var solution = this.data[this.index].from;
		contextString = contextString.replace(solution, this.answerWithTyposMarked.bold());
		this.$context.html (contextString);
	};
	
	this.exerciseSpecificSuccessHandler = function() {
		// Success handling specific to this exercise
		this.reGenerateContext(this.$input.val());
		this.$typoInformation.html(this.typoInformation);
	};
}

Ex1.prototype = Object.create(TextInputExercise.prototype, {
	constructor: Ex1,
	/************************** SETTINGS ********************************/
	description: {value: "Find the word in the context"},
	customTemplateURL: {value: 'static/template/exercise/ex1.html'},
	resultSubmitSource: {value: Settings.ZEEGUU_EX_SOURCE_RECOGNIZE},
});

export default Ex1;