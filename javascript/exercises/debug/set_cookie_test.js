/**
 * This module is only for testing purposes, the end point is /debug
 * */
import Session from '../session';
Session.setSession();

/**
 * TODO this wont be part of final release,
 * it is meant to make testing possible with Heroku and by locally running
 */

let redirect = window.location.protocol + "//" + window.location.hostname;
window.location.href = (redirect === "http://127.0.0.1")? redirect+":5000":redirect;
