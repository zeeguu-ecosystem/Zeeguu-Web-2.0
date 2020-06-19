var ut,Util = {
	/**
	*Returns selected text
	**/
	getSelectedText: function() {
		// Gets clicked on word (or selected text if text is selected)
		var t = '';
		var sel;
		if (window.getSelection && (sel = window.getSelection()).modify) {
			var s = window.getSelection();
			if (s.isCollapsed) {
				s.modify('move', 'forward', 'character');
				s.modify('move', 'backward', 'word');
				s.modify('extend', 'forward', 'word');
				t = s.toString();
				s.modify('move', 'forward', 'character'); //clear selection
			}
			else {
				t = s.toString();
			}
		} else if ((sel = document.selection) && sel.type != "Control") {
			// IE 4+
			var textRange = sel.createRange();
			if (!textRange.text) {
				textRange.expand("word");
			}
			// Remove trailing spaces
			while (/\s$/.test(textRange.text)) {
				textRange.moveEnd("character", -1);
			}
			t = textRange.text;
		}
		return t;
	},

	/**
	 * Check overflow
	 * @param elem {Jquery Element}
	 * @return {Boolean}, true if overflown false otherwise
	 * */
	isMultiline: function (elem) {
		let divHeight = elem.height();
		let lineHeight = parseInt(elem.css('font-size'));
		return ((divHeight / lineHeight) >= 2);
	},
	
	/**
     *	Calculate session time in minutes
	 *	@return string with appended minute
     **/
    calcTimeInMinutes: function (startTime){
        var endTime = new Date();
        var total = endTime.getMinutes()-startTime.getMinutes();
        return (total <= 1)?"1 minute":total + " minutes";
    },
	
	/**
     *	Calculate exercise time in milliseconds
	 *	@return {int} milliseconds
     **/
    calcTimeInMilliseconds: function (startTime){
        var endTime = Date.now();
        var total = endTime - startTime;
        return total;
    },

    /**
     * Calculate size of elements in 2D array
     * @param {int} length, do until that index
     * @param {[int][int]} set, int array
     * */
    calcSize: function(set,length){
        var sum = 0;
        for(var i = 0; i<length; i++){
            sum += set[i][1];
        }
        return sum;
    },
}

var extendObject = function(child,parent){
	var temp = function(){};	
	temp.prototype = parent.prototype;
	child.prototype = new temp();
	child.prototype.constructor = child;
}

export default Util;
