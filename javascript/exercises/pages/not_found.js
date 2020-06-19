/**
 * Not found page, inherits from Empty Page
 * */
import EmptyPage from './empty_page';

function NotFound(){
    //Override  the parameters for the empty page
    let newFields = {
        icon: 'static/img/illustrations/ntd_cloud.png',
        title: "I Found Nothing",
        info: "Let's pretend this never happened.",
        btnPrime: false,
        btnPrimeText: false,
        btnSecond: false,
        btnSecondText: false,
    };
    //Initialize the not found module
	this.init(newFields);
}

NotFound.prototype = Object.create(EmptyPage.prototype, {
	constructor: NotFound,
});
export default NotFound;