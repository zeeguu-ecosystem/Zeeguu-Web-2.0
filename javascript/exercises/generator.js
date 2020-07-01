/** Modular Zeeguu Exercise Generator @authors Martin Avagyan, Vlad Turbureanu
 *  @initialize it using: new Generator(args);
 *  @param args is matrix of exercise name and number of bookmarks,
 *         example: [[1,3],[2,4]] 3 bookmarks for ex1 and 4 bookmarks for ex2
 *  @customize it by using prototypal inheritance
 **/

import $ from 'jquery';
import Ex1 from './exercises/ex1';
import Ex2 from './exercises/ex2';
import Ex3 from './exercises/ex3';
import Ex4 from './exercises/ex4';
import ProgressBar from './progress_bar';
import events from './pubsub';
import swal from 'sweetalert';
import Session from './session';
import {Loader} from './loader';
import Util from './util';
import Validator from './validator';


var Generator = function (set, parentInvocation = "NA") {
    this.init(set, parentInvocation);
};

Generator.prototype = {
    /************************** SETTINGS ********************************/
    data: 0,		//bookmakrs from zeeguu api
    set: 0,			//matrix for initialaizer
    index: 0,		//current index from set
    startTime: new Date(),
    session: Session.getSession(), //Example of session id 34563456 or 11010001
    templateURL: 'static/template/exercise/exercise.html',
    parentInvocation: '',

    /**
     *    Saves the common dom in chache
     **/
    cacheDom: function () {
    },

    /**
     * The function caches imports in local scope for later to be referenced as a string
     * */
    cacheExerciseImports: function () {
        this.Ex1 = Ex1;
        this.Ex2 = Ex2;
        this.Ex3 = Ex3;
        this.Ex4 = Ex4;
    },

    /**
     *    Generator initialaizer
     **/
    init: function (set, parentInvocation) {
        // console.log("initializing generator...");
        this.set = set;
        var _this = this;

        this.validator = new Validator(set);

        this.parentInvocation = parentInvocation;
        // "bind" event
        this.$eventFunc = function () {
            _this.nextEx()
        };
        events.on('exerciseCompleted', this.$eventFunc);

        this.start();
    },

    restart: function () {
        this.start();
    },

    /**
     *    Call to load the data from API
     **/
    start: function () {
        let _this = this;
        //Callback wait until the bookmarks are loaded
        $("#exloader").animate({opacity: 1 / 2}, 1000);

        this.validator.getValidBookMarks(function (ldata) {
            $("#exloader").hide();
            _this.data = (ldata);
            _this.set = _this.validator.validSet;
            //Terminate generator if not enough bookmarks
            if (_this.set == null || _this.set <= 0) {
                _this.terminateGenerator();
                return;
            }
            //Loads the HTML general exercise template from static
            $.when(Loader.loadTemplateIntoElem(_this.templateURL, $("#main-content"))).done(function () {
                // Create the DOM and start the generator
                ProgressBar.init(0, _this.validator.validSize);
                _this.cacheDom();
                _this.cacheExerciseImports();
                _this._constructor();
            });
        });
    },

    filterArray: function (bookmarksData) {
        for (var i = 0; i < bookmarksData.length; i++) {
            var tempIdx = indexOf(bookmarksData[i]);
            if (tempIdx == -1 || tempIdx == i) {
                continue;
            }
            bookmarksData.splice(i, 1);
        }
        return bookmarksData;
    },
    /**
     *    The main constructor
     **/
    _constructor: function () {
        // console.log("in _constructor");
        this.index = 0;
        this.startTime = new Date();
        this.nextEx();
    },

    /**
     *    Add Ex here
     **/
    nextEx: function () {
        // console.log("next ex");
        if (this.index >= this.set.length) {
            this.onExSetComplete();
            return;
        }
        var ex = this.set[this.index][0];
        var size = this.set[this.index][1];
        var startingIndex = Util.calcSize(this.set, this.index);

        if (this.$currentEx) this.$currentEx.terminateExercise();
        this.$currentEx = null;
        delete this.$currentEx;
        //Local scope reference
        this.$currentEx = new (this['Ex' + ex])(this.data, startingIndex, size);
        this.index++;
    },
    /**
     *    Request the submit API
     **/
    submitResults: function () {
        //TODO submit user feedback if any
    },

    /**
     *    When the ex are done perform an action
     **/
    onExSetComplete: function () {
        var _this = this;
        _this.submitResults();
        swal({
                title: "You rock!",
                text: "That took less than " + Util.calcTimeInMinutes(_this.startTime) + ". practice more?",
                type: "success",
                showCancelButton: true,
                confirmButtonColor: "#7eb530",
                confirmButtonText: "Let's do it!",
                cancelButtonText: "To Reading",
                closeOnConfirm: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    ProgressBar.terminate();
                    events.off('exerciseCompleted', this.$eventFunc);
                    ProgressBar.terminate();
                    events.emit('generatorCompleted');
                    location.reload();
                    return;
                }
                var currentUrl = window.location;
                var baseUrl = currentUrl.protocol + "//" + currentUrl.host + "/";
                window.location = baseUrl;
            });
    },

    /**
     * Text and the action that the secondary button should perform
     * @param {String} redirect url
     * @param {String} parentInvocation, who to emit when the action is done
     * @return {Object}, text of the action and the action function
     * */
    finalActions: function (redirect, parentInvocation) {
        let secondaryBtn = 'Go home!';
        let actionFunction = () => {
            _this.invokeParent();
        };

        //If the redirect url is present
        if (redirect != null) {
            secondaryBtn = "Take me away!";
            actionFunction = () => {
                window.location = redirect;
            };
        }
        //If there is no home available create home
        else if (parentInvocation === "NA") {
            actionFunction = () => {
                let redirect = window.location.protocol + "//" + window.location.hostname;
                //Local debuging, wont be part of final code
                window.location.href = (redirect === "http://127.0.0.1") ? redirect + ":5000" : redirect;
            };
        }
        return {btnText: secondaryBtn, actionFunc: actionFunction};
    },

    terminateGenerator: function () {
        events.off('exerciseCompleted', this.$eventFunc);
        ProgressBar.terminate();
        events.emit('generatorCompleted');
    },
    invokeParent: function () {
        events.emit(this.parentInvocation);
    },
};

export default Generator;