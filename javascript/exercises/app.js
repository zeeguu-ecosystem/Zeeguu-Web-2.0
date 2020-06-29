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
page('*', practice);

/******************* Page Settings **********************/
page.exit('*', backFunction);
page({hashbang: true});
page.start();

/********************** Handlers ***********************/


/**
 * Practice route
 * Each exercise card set has its own index
 * @example http://127.0.0.1:5000/#!/practice/0 , practice plan with index 0
 * */
function practice(ctx) {
    
    if (ctx.canonicalPath.match("practice/plan/")) {
        var exerciseType = ctx.canonicalPath.slice(-1);
        console.log("starting exercise session type " + exerciseType)
        window.onload = new Generator(Starter.prototype.exNames[exerciseType].exID);
    }
}

/**
 * When leaving a page, perform the following action
 * Reset all events from pubsub module to prevent interception from past subscribers
 * */
function backFunction(ctx, next) {
    Events.resetAll();
    next();
}

/**
 * Not found page
 * */
function notFound() {
    window.onload = new NotFound();
}






