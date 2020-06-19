/** Modular Zeeguu Powered Exercise @author Martin Avagyan
 *  @initialize it using: new Exercise();
 *  @customize it by using prototypal inheritance
 **/

import $ from 'jquery';
import events from '../pubsub';
import Util from '../util';
import Settings from '../settings';
import Session from '../session';
import {Loader} from '../loader';
import ShakeAnimation from "../animations/shake_animation";
import Feedback from "../feedback";
import Speaker from "../speaker";

var Exercise = function (data, index, size) {
	this.init(data, index, size);
	//TODO unbind method
};

Exercise.prototype = {

	/************************** SETTINGS ********************************/
	data: 0,
	customTemplateURL: 0,
	index: 0,
	startIndex: 0,
	size: 0, //default number of bookmarks
	description: "Solve the exercise",  //default description
	session: Session.getSession(), //Example of session id 34563456 or 11010001
	lang:    '',	//user language
	answer: "",
	startTime: 0,
	isHintUsed: false,
	hintsUsed: 0,
	minRequirement: 1,
	resultSubmitSource: Settings.ZEEGUU_EX_SOURCE_RECOGNIZE,//Defualt submission
	successAnimationTime: 2000,
	exFeedback: 0,
	instanceCorrect: false,
	colourOrange: "#ffbb54",
	isMobileDevice: undefined,
	typoInformation: "",
	answerWithTyposMarked: "",

	/*********************** General Functions ***************************/
	/**
	 *    Loads the HTML exercise template from static
	 **/

	createCustomDom: function () {
		Loader.loadTemplateIntoElem(this.customTemplateURL, $("#custom-content"));
	},

	/**
	*	Saves the common dom in chache
	**/
	cacheDom: function(){
		this.$elem 				= $("#ex-module");
		this.$description  		= this.$elem.find("#ex-descript");
		this.$loader 			= this.$elem.find('#loader');
		this.$statusContainer 	= this.$elem.find('#ex-status-container');
		this.$descriptionContainer = this.$elem.find('#ex-description-container');
		this.$exFooterPrimary 	= this.$elem.find('#ex-footer-primary');
		this.$exFooterSecondary = this.$elem.find('#ex-footer-secondary');
		this.$reportBtn			= this.$elem.find('#btn-report');
		this.$speakBtn			= this.$elem.find('#btn-speak');
		this.cacheCustomDom();
	},

	/**
	 *    Exercise initialaizer
	 **/
	init: function (data, index, size) {
		var _this = this;
		$.when(Loader.loadTemplateIntoElem(_this.customTemplateURL, $("#custom-content"))).done(function () {
			_this.cacheDom();
			_this.generalBindUIActions();
			_this._constructor(data, index, size);
		});
	},


	/**
	 *    The main constructor
	 **/
	_constructor: function (data, index, size) {
		this.data = data;
		this.index = index;
		this.startIndex = index;
		this.size = size;
		this.shake = new ShakeAnimation();
		this.exFeedback = new Feedback(this.resultSubmitSource, this.session, this.onRenderNextEx, this);
        Session.getLanguage((text)=>{this.lang = text});//Set the language with callback
		this.setDescription();
		this.next();
		this.startTime = Date.now();
	},

	/**
	 *    Populates custom exercise description
	 **/
	setDescription: function () {
		this.$description.html(this.description);
	},

	/**
	 *    When the ex are done, notify the observers
	 **/
	onExComplete: function () {
		events.emit('exerciseCompleted');
	},

	/**
	 *    Check selected answer with success condition
	 **/
	checkAnswer: function (chosenWord) {
		if (this.successCondition(chosenWord)) {
			this.onSuccess();
			return;
		}
		this.wrongAnswerAnimation();
		this.submitResult(this.data[this.index].id, Settings.ZEEGUU_EX_OUTCOME_WRONG);
	},

	/**
	 *    Actions taken when the succes condition is true
	 **/
	onSuccess: function () {
		this.$exFooterPrimary.removeClass('mask-appear');
		this.$exFooterSecondary.toggleClass('mask-appear');
		this.handleSuccessCondition();
	},

	/**
	 * Revert the secondary and primary footers
	 * */
	revertPrimary: function () {
		this.$exFooterSecondary.removeClass('mask-appear');
		this.$exFooterPrimary.toggleClass('mask-appear');
	},

	/**
	 * When the answer is successful show the animation and submit the result
	 * */
	handleSuccessCondition: function () {
		this.animateSuccess();
		//Submit the result of translation
		this.submitResult(this.data[this.index].id, Settings.ZEEGUU_EX_OUTCOME_CORRECT);
		this.setInstanceState(true);//Turn on the instance, instance was correctly solved
		this.exerciseSpecificSuccessHandler();
	},



	/**
	 * On success condition true, generate new exercise
	 * */
	onRenderNextEx: function () {
		this.index++;
		this.setInstanceState(false);//Turn off the instance, instance reset to false
		// Notify the observer
		events.emit('progress');
		this.revertPrimary();
		// The current exercise set is complete
		if (this.index == this.size + this.startIndex) {
			this.onExComplete();
			return;
		}
		this.next();
		this.startTime = Date.now();
	},

	/**
	 * Instance switch, changes the instance
	 * @return {void}
	 * */
	setInstanceState: function (state) {
		this.instanceCorrect = state;
	},

	/**
	 * Instance switch, changes the instance
	 * @return {boolean}
	 * */
	getInstanceState: function () {
		return this.instanceCorrect;
	},

	/**
	 *    Request the submit to the Zeeguu API
	 *  e.g. https://www.zeeguu.unibe.ch/api/report_exercise_outcome/Correct/Recognize/1000/4726?session=34563456
	 **/
	submitResult: function (id, exOutcome) {
		let _this = this;
		//If the user used the hint, do not register correct solution, resent the hint, move on
		if (this.isHintUsed && exOutcome == Settings.ZEEGUU_EX_OUTCOME_CORRECT) {
			this.isHintUsed = false;
			this.hintsUsed = 0;
			return;
		}
		//If hint is used twice, ignore request
		if (this.isHintUsed && exOutcome == Settings.ZEEGUU_EX_OUTCOME_HINT) return;
		//Calculate time taken for single exercise
		var exTime = Util.calcTimeInMilliseconds(this.startTime);
		//Request back to the server with the outcome
		//console.log(Settings.ZEEGUU_API + Settings.ZEEGUU_EX_OUTCOME_ENDPOINT + exOutcome +  _this.resultSubmitSource + "/" + exTime + "/" + id + "?session="+this.session);
		$.post(Settings.ZEEGUU_API + Settings.ZEEGUU_EX_OUTCOME_ENDPOINT + exOutcome + _this.resultSubmitSource + "/" + exTime + "/" + id + "?session=" + this.session);
	},

	/**
	 *    Removes focus of page elements
	 **/
	prepareDocument: function () {
		if (document.activeElement != document.body) document.activeElement.blur();
	},

	/**
	 *    User hint handler
	 **/
	handleHint: function () {
		this.submitResult(this.data[this.index].id, Settings.ZEEGUU_EX_OUTCOME_HINT);
		this.isHintUsed = true;
		this.hintsUsed++;

		this.giveHint();
	},

	/**
	 * Function for sending the user feedback for an individual exercise
	 * */
	giveFeedbackBox: function (idx) {
		this.exFeedback.exerciseFeedbackBox(this.data[idx].id);
	},


	/**
	 * Apply style dynamically when content changes
	 * */
	reStyleDom: function () {
		this.reStyleContext();
	},

	/**
	 * Apply style dynamically to context
	 * */
	reStyleContext: function () {
		if(!Util.isMultiline(this.$context)){
			this.$context.addClass('centering');//Text align center
			return;
		}
		this.$context.removeClass('centering');//Text align justify
	},

	/**
	 * Function responsible for text to speech
	 * */
	handleSpeak: function () {
		let speakerObj = this.objectForSpeaker();
		Speaker.speak(speakerObj.text,speakerObj.language);
	},

	/**
	 * Binding of general actions for every exercise
	 * */
	generalBindUIActions: function () {
		//Bind general actions
		this.$reportBtn.click(() => {this.giveFeedbackBox(this.index);});
		this.$speakBtn.click(() => {this.handleSpeak();});

		//Bind custom actions for each exercise
		this.bindUIActions();
	},

	/**
	 * Unbinding of general actions for every exercise
	 * */
	generalUnBindUIActions: function () {
		this.$reportBtn.off( "click");
		this.$speakBtn.off( "click");
		//TODO terminate individual bindings for each exercise,
		//TODO for that implement terminate method for each
	},

	/**
	 * Exercise termination
	 * */
	terminateExercise: function () {
		this.generalUnBindUIActions();
	},

	/**
	 * Text for speaker
	 * @return {Object}, the text to be spoken and the language, @example: {text: animatiefilm, language: "nl"}
	**/
	objectForSpeaker: function(){
		return {text: this.data[this.index].from, language: this.data[this.index].from_lang};
	},
	
	/**
	 * Advance the exercise when the enter key is pressed.
	 **/
	enterKeyup: function(event){
		if(event.keyCode == 13){
			if(!this.getInstanceState())//If in the primary state of footer
				this.$checkAnswer.click();
			else //If in the secondary state of footer
				this.$nextExercise.click();
		}
	},

	/*********************** Interface functions *****************************/
	/**
	*	Binding UI with Controller functions
	**/
	bindUIActions: function(){},
	
	/**
	*	Condition used by checkAnswer 
	*	If true, then a correct answer was given
	**/
	successCondition: function(){},
	
	
	/**
	*	Gives a hint when the hint button is pressed
	**/
	giveHint: function (){},
	
	/**
	*	Populates the next exercise
	**/
	next: function (){},
	
	/**
	*	Cahes custom dom of the exercise
	**/
	cacheCustomDom: function(){},

	/**
	*	Animation for wrong solution
	**/
	wrongAnswerAnimation: function(){},

	/************************** Animations ********************************/	

	/**
	*	Animation for successful solution
	**/
	animateSuccess: function(){
		let _this = this;
		this.$descriptionContainer.addClass('hide');
		this.$statusContainer.removeClass('hide');
		setTimeout(function(){
			if (_this.$statusContainer.length > 0) {
				_this.$statusContainer.addClass('hide');
			}
		}, _this.successAnimationTime);
	},	
	
	/************************ Mobile functionality ************************/
	/**
	 * Check whether a mobile device is being used, by comparing the browser user agent to a regex.
	 * Source: https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
	 * Source: http://detectmobilebrowsers.com/
	 * @return {boolean}
	**/
	checkMobile: function() {
		var check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	},
	
	/**
	 * Check whether a mobile device is being used. A stored variable is used to avoid running the regex multiple times.
	 * @return {boolean}
	**/
	isMobile: function() {
		if (this.isMobileDevice === undefined) {
			this.isMobileDevice = this.checkMobile();
		}
		
		return this.isMobileDevice;
	},
};

export default Exercise;