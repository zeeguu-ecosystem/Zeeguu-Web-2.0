/**
 * Starter module, inherits from Home
 * */
import $ from 'jquery';
import Home from './home';

function Starter(){
	this.init();

	/** @Override */
	this.cacheDom =  function(){
		this.$elem 			= $("#starter-body");
		this.$exCards 		= this.$elem.find("#exercieses-cards");
		this.$attribution 	= this.$elem.find("#attribution");
		this.$credits 		= this.$elem.find("#credits");
	}
}

Starter.prototype = Object.create(Home.prototype, {
	constructor: Starter,
	/************************** SETTINGS ********************************/
	screenTemplateURL: {value:  'static/template/starter/starter.html'},
	cardTemplateURL: {value: 'static/template/starter/plan_card.html'},
	currentInvocation: {value: 'starterScreenRestart'},
	exNames: {
		value: [
			{
				name: "Easy",
				exID: [[1, 2],[2, 2], [3, 1], [2, 2], [1, 2], [3,1]],
				info: 'Three exercise types.',
				icon: 'static/img/icons/starter/eleph1.svg',
				gradientColor: 'starter-btn-header-level1',
				time: 10
			},
			{
				name: "Regular",
				exID: [[2, 4], [1, 1], [3, 1],[2, 1], [4, 1], [2, 3],[1, 2],[3, 1],[2, 2],[3, 1]],
				info: 'Four exercise types.',
				icon: 'static/img/icons/starter/eleph2.svg',
				gradientColor: 'starter-btn-header-level2',
				time: 15
			},
			{
				name: "Ambitious",
				exID: [[1, 1], [2, 2], [3, 1], [4, 1], [2, 2], [1, 2], [2, 2],[1, 3],[3, 1],[1, 2],[2, 2],[3, 1],[4, 2],[2, 2],[1, 2],[3,1]],
				info: 'Only for the brave :)',
				icon: 'static/img/icons/starter/eleph3.svg',
				gradientColor: 'starter-btn-header-level3',
				time: 25
			},
		]
	},
});

export default Starter;