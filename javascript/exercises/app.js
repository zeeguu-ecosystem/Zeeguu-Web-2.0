/**
 * Application Starting point
 * Rounters and Handles defined here
 */
import page from "page";
import Generator from './generator';
import Starter from './pages/starter';
import NotFound from './pages/not_found';
import Events from './pubsub';


/********************** Routes **************************/
page('/', redirect);
page('/practice', index);
page('/practice/get-ex', getEx);
page('/practice/plan/:practicePlan', practice);
page('/*', notFound);

/******************* Page Settings **********************/
page.exit('*', backFunction);
page({hashbang:true});
page.start();

/********************** Handlers ***********************/

function redirect() {
    page.redirect("/practice");
}
/**
 * Main starter screen route
 * */
function index() {
    window.onload = new Starter();
}

/**
 * Get-ex route
 * */
function getEx() {
    //For now hand codded exercise generator
    window.onload = new Generator([[1,5],[2,3]]);
}

/**
 * Practice route
 * Each exercise card set has its own index
 * @example http://127.0.0.1:5000/#!/practice/0 , practice plan with index 0
 * */
function practice(ctx) {
    window.onload = new Generator(Starter.prototype.exNames[ctx.params.practicePlan].exID);
}

/**
 * When leaving a page, perform the following action
 * Reset all events from pubsub module to prevent interception from past subscribers
 * */
function backFunction(ctx,next) {
    Events.resetAll();
    next();
}

/**
 * Not found page
 * */
function notFound(){
    window.onload = new NotFound();
}






