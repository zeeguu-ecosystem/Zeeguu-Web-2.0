import $ from 'jquery';
import Generator from '../generator';
import events from '../pubsub';
import Mustache from 'mustache';
import {Loader} from '../loader';
import * as page from "page";

var Home = function(){
	this.init();
};

Home.prototype = {
	
	/************************** SETTINGS ********************************/	
	screenTemplateURL: 'static/template/home/home.html',
	cardTemplateURL: 'static/template/home/card.html',
	cardTemplate: 0,

	currentInvocation: 'homeRestart',			//Event name for invoking start on current module
	generatorInvocation: 'generatorCompleted',	//Event name for invoking reset on the active generator (memory leaks prevention)
	currentlyActiveGenerator: 0,				//Reference to the active generator

	eventGeneratorCompletedFunc: 0,				//Function reference to resetGenerator()
    eventCurrentRestartFunc: 0,					//Function reference to start()

	exNames: [
		{
			name: "Find",
			exID: [[1, 3]],
			info: 'Find the word in the context',
			icon: 'static/img/icons/search-engine.svg',
			time: 2
		},
		{
			name: "Choose",
			exID: [[2, 4]],
			info: 'Choose the word that fits the context',
			icon: 'static/img/icons/test.svg',
			time: 2
		},
		{
			name: "Match",
			exID: [[3, 4]],
			info: 'Match each word with its translation',
			icon: 'static/img/icons/question.svg',
			time: 3
		},
		{
			name: "Translate",
			exID: [[4, 3]],
			info: 'Translate the word given in the context',
			icon: 'static/img/icons/translator.svg',
			time: 2
		},
		{
			name: "Short Practice",
			exID: [[1, 3], [2, 3]],
			info: 'General exercise for short practice',
			icon: 'static/img/icons/placeholder.svg',
			time: 3
		},
		{
			name: "Long Practice",
			exID: [[1, 3], [2, 3], [3, 3], [4, 3]],
			info: 'General exercise for short practice',
			icon: 'static/img/icons/placeholder.svg',
			time: 4
		},
		{
			name: "Random",
			exID: [[2, 3], [1, 3], [3, 3], [4, 3], [1, 3]],
			info: 'Repeat via random exercises',
			icon: 'static/img/icons/shuffle.svg',
			time: 6
		},
	],
	/*********************** General Functions ***************************/	
	/**
	*	Saves the dom 
	**/
	cacheDom: function(){
		this.$elem 			= $("#home-body");		
		this.$exCards 		= this.$elem.find("#exercieses-cards");	
		this.$attribution 	= this.$elem.find("#attribution");	
		this.$credits 		= this.$elem.find("#credits");	
	},
	
	
	/**
	*	Exercise initialaizer
	**/
	init: function(){	
		var _this = this;
		// "bind" event
		this.eventGeneratorCompletedFunc = function(){_this.resetGenerator();};
		this.eventCurrentRestartFunc = function(){_this.start();};
		events.on(this.generatorInvocation,this.eventGeneratorCompletedFunc);
		events.on(this.currentInvocation,this.eventCurrentRestartFunc);
		this.start();
	},

    /**
	*	The main constructor
	**/
	start: function (){	
		var _this = this;
		$.when(Loader.loadTemplateIntoElem(_this.screenTemplateURL,$("#main-content")),
		Loader.loadTemplate(this.cardTemplateURL)).done(function(homeData,cardData){
			_this.cardTemplate = cardData[0];//cardData[0] string html
			// Create the DOM and start the generator
			_this.cacheDom();
			_this.generateExerciseCards();
			_this.bindUIActions();
		});
	},

	/**
	 * UI actions are binded here
	 * */
	bindUIActions: function(){
		//Bind UI action of attribution to the function
		var _this = this;
		this.$credits.on("click", _this.handleAttribution.bind(this));
	},

	bindCards: function () {
		var exs = this.$exCards.children();
		for(var i = 0; i < exs.length; i++){
			var id = exs[i].getAttribute("ex-id");
			$(exs[i]).on("click", this.newEx.bind(this,id));
		}
	},

	/**
	 * Attribution footer
	 * On click show/hide attribution
	 * @return {void}
	 * */
	handleAttribution: function(){
		let isHidden = this.$attribution.hasClass("hide");
		if(!isHidden){
			this.$attribution.addClass("hide");
			return;
		}
		this.$attribution.removeClass("hide");
	},

	/**
	 * Genrate screen cards
	 * */
	generateExerciseCards: function(){
		//The index function find the current index of the Array of Exercises
		var cardNames = {
			Exercises: this.exNames,
			index: function() {return cardNames.Exercises.indexOf(this);}
		};

		this.$exCards.append(Mustache.render(this.cardTemplate,cardNames));
	},
	
	/**
	 * Parse string into 2D array as a generator argument
	 * @return {Array}, the array containing exercise set used in generator
	 * TODO can be overriten by eval
	*/
	exArrayParser: function(stringArray){		
		var arr = stringArray.split(",").map(function(x){return parseInt(x)});
		var newArr = [];
		while(arr.length) newArr.push(arr.splice(0,2));
		return newArr;
	},


	/**
	 * Resets generator, clears the memory
	 * */
	resetGenerator: function(){
		this.currentlyActiveGenerator = null;
        delete this.currentlyActiveGenerator;
	},
	
	/**
	 * Terminate the module, unbind events.
	 * */
	terminate: function(){
		events.off(this.generatorInvocation,this.eventGeneratorCompletedFunc);
        events.off(this.currentInvocation,this.eventCurrentRestartFunc);
		//emit listeners that the home is terminated
	},
	
	/**
	 * Generate an exercise set
	 * @param {String} exID the id in the form of a string
	 * */
	newEx: function(exID){
		this.currentlyActiveGenerator = new Generator(this.exArrayParser(exID),this.currentInvocation);
	},
};

export default Home;

