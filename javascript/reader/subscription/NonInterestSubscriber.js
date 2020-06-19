import $ from 'jquery';
import Mustache from 'mustache';
import swal from 'sweetalert';
import UserActivityLogger from '../UserActivityLogger';
import ZeeguuRequests from '../zeeguuRequests';
import { GET_AVAILABLE_TOPICS, GET_SUBSCRIBED_FILTERS } from '../zeeguuRequests';

const HTML_ID_FEED_TEMPLATE = '#noninterests-template';
const USER_EVENT_OPENED_FEEDSUBSCRIBER = 'OPEN FILTERSUBSCRIBER';
const NONINTERESTS = ".show-filter-subscriber";
const INTERESTS = ".show-topic-subscriber";
const ALL_NONINTERESTS = ".tagsOfNonInterests";
const NONINTEREST_CSS = ".noninterest";
const SUBSCRIBED = "subscribed"
const ADD_CUSTOM_NONINTEREST = ".addNonInterestButton";
const CUSTOM_NONINTEREST_BUTTON = "noninterests custom";
const CLOSE_BUTTON = ".closeTagsOfNonInterests";

let self;

/**
 * Allows the user to add and remove non-interest subscriptions.
 */
export default class NonInterestSubscriber {

    /**
     * Link the {@link NonInterestSubscriptionList} with this instance so we can update it on change.
     * @param nonInterestSubscriptionList
     * @param customNonInterestSubscriptionList
     */
    constructor(nonInterestSubscriptionList, customNonInterestSubscriptionList) {
        this.nonInterestSubscriptionList = nonInterestSubscriptionList;
        this.customNonInterestSubscriptionList = customNonInterestSubscriptionList;
        self = this;
    }

    follow(input) {
        this.customNonInterestSubscriptionList.follow(input)
    }

    /**
     * Open the dialog window containing the list of avaible and subscribed non-interests.
     */
    open() {
        UserActivityLogger.log(USER_EVENT_OPENED_FEEDSUBSCRIBER);
        document.querySelector(ALL_NONINTERESTS).style.display = "block";
        document.querySelector(INTERESTS).disabled = true;
        this._makeCloseable();
        this._addNonInteres();
    }

    /**
     * Calls the two functions of the class that requests the available and subscribed non-interests.
     */
    load() {
        this.loadAvailable();
        this.loadSubscribed();
    }

    /**
     * Call Zeeguu and requests available non-interests.
     * Uses {@link ZeeguuRequests}.
     */
    loadAvailable() {
        ZeeguuRequests.get(
            GET_AVAILABLE_TOPICS,
            {},
            this._loadAvailableNonInterests.bind(this)
        );
    }

    /**
    * Call Zeeguu and requests subscribed non-interests.
    * Uses {@link ZeeguuRequests}.
    */
    loadSubscribed() {
        ZeeguuRequests.get(
            GET_SUBSCRIBED_FILTERS,
            {},
            this._loadSubscribedNonInterests.bind(this),
        );
    }

    /**
     * Fills the dialog's list with all the subscribed non-interests.
     * Callback function for zeeguu.
     * @param {Object[]} data - A list of topics the user has added as a non-interest.
     */
    _loadSubscribedNonInterests(data) {
        let template = $(HTML_ID_FEED_TEMPLATE).html();
        let custom = document.getElementsByClassName(CUSTOM_NONINTEREST_BUTTON);
        $(custom).removeClass(SUBSCRIBED);
        for (let i = 0; i < data.length; i++) {
            let feedOption = $(Mustache.render(template, data[i]));
            let nonInterest = $(feedOption.find(NONINTEREST_CSS));
            $(nonInterest).addClass(SUBSCRIBED);
            nonInterest.click(
                (function (data, feedOption, nonInterestSubscriptionList) {
                    return function () {
                        if ($(nonInterest).hasClass(SUBSCRIBED)) {
                            nonInterestSubscriptionList._unfollow(data);
                            $(nonInterest).removeClass(SUBSCRIBED);
                            console.log("unsubscribed non-interest");
                        }
                        else {
                            nonInterestSubscriptionList.follow(data);
                            $(nonInterest).addClass(SUBSCRIBED);
                            console.log("subscribed non-interest");
                        }
                    }
                })(data[i], feedOption, this.nonInterestSubscriptionList)
            );
            this._appendNonInerest(template, feedOption);
        }
    }

    /**
     * Fills the dialog's list with all the available non-interests.
     * Callback function for zeeguu.
     * @param {Object[]} data - A list of topics the user can add as a non-interest.
     */
    _loadAvailableNonInterests(data) {
        let template = $(HTML_ID_FEED_TEMPLATE).html();
        for (let i = 0; i < data.length; i++) {
            let feedOption = $(Mustache.render(template, data[i]));
            let nonInterest = $(feedOption.find(NONINTEREST_CSS));
            nonInterest.click(
                (function (data, feedOption, nonInterestSubscriptionList) {
                    return function () {
                        if ($(nonInterest).hasClass(SUBSCRIBED)) {
                            nonInterestSubscriptionList._unfollow(data);
                            $(nonInterest).removeClass(SUBSCRIBED);
                            console.log("unsubscribed non-interest");
                        } else {
                            nonInterestSubscriptionList.follow(data);
                            $(nonInterest).addClass(SUBSCRIBED);
                            console.log("subscribed non-interest");
                        }
                    };
                })(data[i], feedOption, this.nonInterestSubscriptionList)

            );
            this._appendNonInerest(template, feedOption);
        }
    }

    _appendNonInerest(template, feedOption) {
        $(ALL_NONINTERESTS).append(feedOption);
    }

    _addNonInteres() {
        let addCustomNonInterest = document.querySelector(ADD_CUSTOM_NONINTEREST);
        $(addCustomNonInterest).click(function () {
            swal.close();
            setTimeout(function () {
                swal({
                    title: 'Add a non-interst!',
                    type: 'input',
                    inputPlaceholder: "non-interest",
                    allowOutsideClick: true,
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonColor: "#ffbb54",
                    confirmButtonText: 'Add',
                    cancelButtonText: 'Close',
                }, function (input) {
                    if (input === "" || input === false) {
                        return false
                    }
                    self.customNonInterestSubscriptionList.follow(input);
                })
            }, 150);
        });
    }

    _makeCloseable() {
        let closeNonInterests = document.querySelector(NONINTERESTS);
        $(closeNonInterests).click(function () {
            document.querySelector(ALL_NONINTERESTS).style.display = "none";
            location.reload();
        });

        let closeNonInterestsButton = document.querySelector(CLOSE_BUTTON);
        $(closeNonInterestsButton).click(function () {
            document.querySelector(ALL_NONINTERESTS).style.display = "none";
            location.reload();
        });
    }

};
