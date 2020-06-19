/** Custom exercise for translating the word given in the context. Inherited from Exercise.js
 *  @initialize it using: new Ex4();
 *  @customize it by using prototypal inheritance 
**/

import $ from 'jquery';
import TextInputExercise from './textInputExercise';
import Util from '../util';
import Settings from "../settings";

function Ex4(data,index,size){
	this.init(data,index,size);
	
	/** @Override */
	this.bindUIActions = function(){
		//Bind UI action of Hint/Show solution to the function		
		this.$showSolution.on("click", this.handleHint.bind(this));
		
		//Bind UI action of Check answer to the function
		this.$checkAnswer.on("click", this.checkAnswer.bind(this));
		
		// Bind UI Enter Key
		this.$input.keyup(this.enterKeyup.bind(this));

		//Next exercise clicked
		this.$nextExercise.on("click",this.onRenderNextEx.bind(this));
		
		//Feedback for the previous bookmark: this.index
		this.$feedbackBtn.click(() => {this.giveFeedbackBox(this.index);});
	};

	/** @Override */
	this.next = function (){			
		this.$to.html ("&zwnj;");
		this.$context.html(this.generateContext());
		this.$input.val("").attr("placeholder", "Type or click a word");
		this.reStyleDom();
		this.answer = this.data[this.index].to;
		this.$descriptionContainer.removeClass('hide');
		this.$typoInformation.html("");
		
		if (!this.isMobile()) {
			this.$input.val("").focus();
		}
	};
	
	this.generateContext = function(){
		var contextString = this.data[this.index].context;
		var phrase = this.data[this.index].from;
		contextString = contextString.replace(phrase, phrase.bold());
			
		return contextString;		
	};
	
	this.exerciseSpecificSuccessHandler = function() {
		// Success handling specific to this exercise
		var translation = this.answerWithTyposMarked.bold();
		this.$to.html (translation);
		this.$typoInformation.html(this.typoInformation);
	};
};

Ex4.prototype = Object.create(TextInputExercise.prototype, {
	constructor: Ex4,
	/************************** SETTINGS ********************************/
	description: {value: "Translate the highlighted word"},
	customTemplateURL: {value: 'static/template/exercise/ex4.html'},
	resultSubmitSource: {value: Settings.ZEEGUU_EX_SOURCE_TRANSLATE},
});

export default Ex4;