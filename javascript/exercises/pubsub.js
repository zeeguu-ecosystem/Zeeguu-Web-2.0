/**
 * Event listener implemented using publish subscribe pattern
 * There is only one object of this class through application
 * */
var events = (function() {
    var events = {};
    var debugging = false;

    function on(eventName, fn) {
        events[eventName] = events[eventName] || [];
        events[eventName].push(fn);
        debug("ON: ");
    }
    function off(eventName, fn) {
        if (events[eventName]) {
            for (var i = 0; i < events[eventName].length; i++) {
                if( events[eventName][i] === fn ) {
                    events[eventName].splice(i, 1);
                    break;
                }
            }
        }
        debug("OFF: ");
    }
    function emit(eventName, data) {
        if (events[eventName]) {
            events[eventName].forEach(function(fn) {
                fn(data);
            });
        }
        debug("EMIT: ");
    }
    function debug(msg){
        if(!debugging) return;

        console.info(msg);
        console.info(events);
    }
    function resetAll() {
        events = {};
        debug("Reset All: ");
    }
    function removeEvent(eventName) {
        delete events[eventName];
    }
    return {
        on: on,
        off: off,
        emit: emit,
        resetAll: resetAll,
    };

})();

export default events;