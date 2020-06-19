/** Modular progress bar @author Martin Avagyan
 *  Initialize it using ProgressBar.init(percent,size);
 *  Add progress using  ProgressBar.move();
**/
import events from './pubsub';

var bar,ProgressBar = {
	settings:{
		percent: 0, //default starting point
		amount: 25, //default value for progress amount
		elem: 0,
	},	
	init: function(percent,size){	
		this.bindUIActions();		
		bar = this.settings;
		bar.percent = percent;
		bar.amount = 100/size;
		bar.elem = document.getElementById("ex-bar");
		bar.elem.style.width = bar.percent;
		// "bind" event
		events.on('progress', this.move);
	},	
	restart: function(){
		bar.percent = 0;
		bar.elem.style.width = bar.percent;
	},	
	bindUIActions: function() {},	
	move: function() {  
		  var width = bar.percent;
		  var id = setInterval(frame, 10);
		  var max_move = bar.percent+bar.amount;
		  function frame() {
			if (width >= max_move || width >=100) {
			  clearInterval(id);
			} else {
			  width++; 			  
			  bar.elem.style.width = width + '%'; 
			}
			bar.percent = max_move;
		}
	},
	terminate: function () {
		events.off('progress', this.move);
	},
};

export default ProgressBar;