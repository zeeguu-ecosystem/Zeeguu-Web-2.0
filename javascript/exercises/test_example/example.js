export default class Bear{
	constructor(type = 'any'){
		this.type = type;
	}
	
	growl(says = 'grrr'){
		return 'The ' + this.type + ' bear says ' + says;
	}
}