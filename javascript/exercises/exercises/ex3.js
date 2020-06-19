/** Custom exercise for matching three pairs of words. Inherited from Exercise.js
 *  @initialize it using: new Ex3();
 *  @customize it by using prototypal inheritance 
**/

import $ from 'jquery';
import Exercise from "./exercise";
import Settings from "../settings";

function Ex3(data,index,size){
	this.init(data,index,size);
	
	/** @Override */
	this.cacheCustomDom = function(data,index,size){
		this.$to						= this.$elem.find("#ex-to");
		this.$context				= this.$elem.find("#ex-content");
		this.$checkAnswer		= this.$elem.find("#check_answer");		
		this.$showSolution	= this.$elem.find("#show_solution");
		this.$btn1					= this.$elem.find("#btn1");
		this.$btn2					= this.$elem.find("#btn2");
		this.$btn3					= this.$elem.find("#btn3");	
		this.$btn4					= this.$elem.find("#btn4");
		this.$btn5					= this.$elem.find("#btn5");
		this.$btn6					= this.$elem.find("#btn6");
		this.$nextExercise	= this.$elem.find('#next-exercise');
		this.$optionBtn			= this.$elem.find('.option-btn');
    this.$feedbackBtn		= this.$elem.find('#feedback');
	};
	
	/** @Override */
	this.bindUIActions = function(){
		//Bind UI action of Hint/Show solution to the function		
		this.$showSolution.on("click", this.handleHint.bind(this));
		
		//Bind UI action of button 1 click to the function
		this.$btn1.on("click", this.selectChoice.bind(this,1));
		
		//Bind UI action of button 2 click to the function
		this.$btn2.on("click", this.selectChoice.bind(this,2));
		
		//Bind UI action of button 3 click to the function
		this.$btn3.on("click", this.selectChoice.bind(this,3));
		
		//Bind UI action of button 4 click to the function
		this.$btn4.on("click", this.selectChoice.bind(this,4));
		
		//Bind UI action of button 5 click to the function
		this.$btn5.on("click", this.selectChoice.bind(this,5));
		
		//Bind UI action of button 6 click to the function
		this.$btn6.on("click", this.selectChoice.bind(this,6));
		
		// Bind UI Enter Key
		$(document).keyup(this.enterKeyup.bind(this));

		//Next exercise clicked
		this.$nextExercise.on("click",this.onRenderNextEx.bind(this));
		
    //Feedback for the previous bookmark: this.index
		this.$feedbackBtn.click(() => {this.giveFeedbackBox(this.index);});
		
	};

	/** @Override */
	this.wrongAnswerAnimation = function(){
		this.shake.shakeFocusedElement();
	}
	
	
	
	this.selectChoice = function(btnID){
		// if no button was previously selected, select it now
		if(this.chosenButton == -1){
			this.chosenButton = btnID;
		}else{
			// otherwise check the selection
			this.check(btnID);
		}
	};
	
	// Disables correctly selected buttons
	this.successDisableBtn = function(btnID){
		var elem = $("#btn"+btnID);
		elem.prop('disabled', true);
		elem.removeClass("btn-default");
		
		// Determine success button colour by number of correct answers
		switch (this.correctAnswers) {
			case 0:
				elem.addClass("ex3-btn-dark-green");
				break;
			case 1:
				elem.addClass("ex3-btn-medium-green");
				break;
			case 2:
				elem.addClass("ex3-btn-light-green");
				break;
		}
		
	};
	
	//Checks if a button is disabled
	this.isDisabled = function(btnID){
		var elem = $("#btn"+btnID);
		return elem.is(':disabled');
	};
	
	// Checks answers
	this.check = function(btnID){
	
		if(this.checkCondition(btnID)){
			
			// Disable buttons		
			this.successDisableBtn(btnID);
			this.successDisableBtn(this.chosenButton);
			
			this.correctAnswers ++;
			this.endExercise();
			
		}else{
			this.wrongAnswerAnimation();
		}
		this.chosenButton = -1;	
	};
	
	this.endExercise = function(){
		// check if all the answers were given
		if(this.successCondition(0)){
			// Proceed to next exercise
			this.checkAnswer(0);
			
			// Prepare the document
			this.prepareDocument();
			
			// Reset answers, hints
			this.correctAnswers = 0;
			this.hints = 0;
		}
	};
	
	// Checks the selected buttons
	this.checkCondition = function(btnID){
		if((this.answers.indexOf(btnID) == -1)|| (this.choices.indexOf(this.chosenButton) == -1)){
			return (this.choices.indexOf(btnID) == this.answers.indexOf(this.chosenButton));
		}else{
			return (this.answers.indexOf(btnID) == this.choices.indexOf(this.chosenButton));
		}
	};
	
	/** @Override */
	this.successCondition = function(a){
		return (this.correctAnswers >= 3); 
	};
	
	// Resets all the disabled buttons
	this.resetBtns = function(){
		for(var idx = 1; idx<=6; idx++){
			var elem = $('#btn'+idx);
			elem.prop('disabled', false);
			elem.removeClass("btn-success");
		}
	};
	
	/** @Override */
	this.next = function (){
		this.$descriptionContainer.removeClass('hide');
		this.populateButtons();
		this.resetBtns();
	};
	
	// Populates the buttons
	this.populateButtons = function(){	
		//Random options
		var idxs = this.randomNumsInRange(2,this.data.length-1);
		var _this = this;
		// random numbers between 1 and 3
	    this.choices  = this.arrayWithRandomNumsUpTo(3);
		 
		// random numbers between 4 and 6
		this.answers = this.arrayWithRandomNumsUpTo(3);
		for (var i=0; i<this.answers.length; i++){
			this.answers[i] = this.answers[i] + 3;
		}
		
		//Populate buttons
		function match2Buttons(choice, answer, valueFrom, valueTo) {
			_this["$btn"+choice].text(valueFrom);
			_this["$btn"+answer].text(valueTo);
		}
		
		match2Buttons(this.choices[0],this.answers[0],this.data[this.index].from,this.data[this.index].to);
		match2Buttons(this.choices[1],this.answers[1],this.data[idxs[0]].from,this.data[idxs[0]].to);
		match2Buttons(this.choices[2],this.answers[2],this.data[idxs[1]].from,this.data[idxs[1]].to);
	};
	
	
	// Gives a hint by disabling a correct match
	this.giveHint = function (){
		// Only one hint is possible
		if(this.hints < 1){
			// Disable buttons
			if(this.disableHintButtons(0)) return;
			if(this.disableHintButtons(1)) return;
			if(this.disableHintButtons(2)) return;
		}
	};
	
	// Disables the buttons given in the hint
	this.disableHintButtons = function(idx){
		if(!this.isDisabled(this.answers[idx])){
			this.successDisableBtn(this.choices[idx]);
			this.successDisableBtn(this.answers[idx]);
			this.correctAnswers++;
			this.hints++;
			this.endExercise();
			return true;
		}
		return false;
	};
	
	/** Generates an array of random numbers of given size
	* @param size: defines how many random numbers we want
	*				the resulted random numbers will in the range of [1,size]
	*/
	this.arrayWithRandomNumsUpTo = function(size){
		var arr = [];	
		while(arr.length < size){
			var randomnumber = Math.ceil(Math.random()*size);	
			if((arr.indexOf(randomnumber) > -1)) continue;
			arr[arr.length] = randomnumber;
		}		
		return arr;
	};
	
	/** Generates an array of random numbers of given size
	* @param size:  defines how many random numbers we want
	* @param range: defines the upper limit of the numbers: [1,range]
	*/
	this.randomNumsInRange = function(size,range){
		var arr = [];	
		while(arr.length < size){
			var randomnumber = Math.ceil(Math.random()*range);
			if((arr.indexOf(randomnumber) > -1) || randomnumber==this.index) continue;
			arr[arr.length] = randomnumber;
		}		
		return arr;
	};
	
	this.exerciseSpecificSuccessHandler = function() {
		// Success handling specific to this exercise
	};
};

Ex3.prototype = Object.create(Exercise.prototype, {
	constructor: Ex3,
	/************************** SETTINGS ********************************/	
	description: {value: "Match each word with its translation"},
	customTemplateURL: {value: 'static/template/exercise/ex3.html'},
	choices: 	 { writable: true, value:[1,2,3]},				// arr of indexes of possible choices
	answers: 	{ writable: true, value:[1,2,3]},				// arr of indexes of possible answers
	chosenButton: { writable: true, value:-1},  	// ID of currently selected button; -1 means no button is selected
	correctAnswers: { writable: true, value:0},	// number of correct answers
	hints: {writable:true, value:0},			// max number of possible hints is 1
    minRequirement: { writable: true, value:4},	// minimum number required for the ex
	resultSubmitSource: {value: Settings.ZEEGUU_EX_SOURCE_MATCH},
	/*******************************************************************/
});

export default Ex3;