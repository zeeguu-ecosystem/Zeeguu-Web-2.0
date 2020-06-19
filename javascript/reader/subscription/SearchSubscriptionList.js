import $ from 'jquery'
import Mustache from 'mustache';
import config from '../config';
import Notifier from '../Notifier';
import 'loggly-jslogger';
import UserActivityLogger from '../UserActivityLogger';
import ZeeguuRequests from '../zeeguuRequests';
import { GET_SUBSCRIBED_SEARCHES } from '../zeeguuRequests';
import { SUBSCRIBE_SEARCH_ENDPOINT } from '../zeeguuRequests';
import { UNSUBSCRIBE_SEARCH_ENDPOINT } from '../zeeguuRequests';
import { reload_articles_on_drawer_close } from "./main.js";

//const HTML_ID_FEED_TEMPLATE = "#topicAddable-template";
const HTML_ID_SUBSCRIPTION_LIST = '#searchesList';
const HTML_ID_SUBSCRIPTION_TEMPLATE = '#subscription-template-search';
const HTML_CLASS_REMOVE_BUTTON = '.removeButton';
const USER_EVENT_FOLLOWED_FEED = 'FOLLOW SEARCH';
const USER_EVENT_UNFOLLOWED_FEED = 'UNFOLLOW SEARCH';
const ALL_INTERESTS = ".tagsOfInterests";

/* Setup remote logging. */
let logger = new LogglyTracker();
logger.push({
    'logglyKey': config.LOGGLY_TOKEN,
    'sendConsoleErrors': true,
    'tag': 'SearchSubscriptionList'
});

/**
 * Shows a list of all subscribed searches, allows the user to remove them.
 * It updates the {@link ArticleList} accordingly.
 */
export default class SearchSubscriptionList {
    /**
     * Initialise an empty {@link Map} of searchs.
     */
    constructor() {
        this.searchList = new Map();
    }

    /**
     *  Call zeeguu and retrieve all currently subscribed searches.
     *  Uses {@link ZeeguuRequests}.
     */
    load() {
        ZeeguuRequests.get(GET_SUBSCRIBED_SEARCHES, {}, this._loadSubscriptions.bind(this));
    };

    /**
     * Remove all searches from the list, clear {@link ArticleList} as well.
     */
    clear() {
        $(HTML_ID_SUBSCRIPTION_LIST).empty();
    };

    /**
     * Call clear and load successively.
     */
    refresh() {
        // Refresh the search list.
        this.clear();
        this.load();
    };

    /**
     * Fills the subscription list with all the subscribed searches.
     * Callback function for the zeeguu request,
     * makes a call to {@link ArticleList} in order to load the search's associated articles.
     * @param {Object[]} data - List containing the searches the user is subscribed to.
     */
    _loadSubscriptions(data) {
        for (let i = 0; i < data.length; i++) {
            this._addSubscription(data[i]);
        }
    }

    /**
     * Add the search to the list of subscribed searches.
     * @param {Object} search - Data of the particular search to add to the list.
     */
    _addSubscription(search) {
        if (this.searchList.has(search.id))
            return;
        let template = $(HTML_ID_SUBSCRIPTION_TEMPLATE).html();
        let subscription = $(Mustache.render(template, search));

        let remove = $(subscription.find(".mdl-chip__action.interests.custom"));
        let _unfollow = this._unfollow.bind(this);
        remove.click(function (search) {
            return function () {
                _unfollow(search);
                $(remove).fadeOut();
                console.log("removed")
            };
        }(search));



        //$(subscription).addClass("mdl-chip__action interests");
        //.addClass("addableTitle").removeClass("mdl-chip__text");
        $(ALL_INTERESTS).append(subscription);
        this.searchList.set(search.id, search);
    }

    /**
     * Subscribe to a new search, calls the zeeguu server.
     * Uses {@link ZeeguuRequests}.
     * @param {Object} search_terms - Data of the particular search to subscribe to.
     */
    follow(search_terms) {
        UserActivityLogger.log(USER_EVENT_FOLLOWED_FEED, search_terms);
        this._loading();
        let callback = ((data) => this._onSearchFollowed(search_terms, data)).bind(this);
        ZeeguuRequests.get(SUBSCRIBE_SEARCH_ENDPOINT + "/" + search_terms, {}, callback);
    }

    /**
     * A search has just been followed, so we call the {@link ArticleList} to update its list of articles.
     * If there was a failure to follow the search, we notify the user.
     * Callback function for Zeeguu.
     * @param {Object} search_terms - Data of the particular search that has been subscribed to.
     * @param {string} reply - Reply from the server.
     */
    _onSearchFollowed(search_terms, reply) {
        if (reply != null) {
            this._addSubscription(reply);
            this._changed();
        } else {
            Notifier.notify("Network Error - Could not follow " + search_terms + ".");
            logger.push("Could not follow '" + search_terms + "'. Server reply: \n" + reply);
        }
    }

    /**
     * Un-subscribe from a search, call the zeeguu server.
     * Uses {@link ZeeguuRequests}.
     * @param {Object} search - Data of the particular search to unfollow.
     */
    _unfollow(search) {
        UserActivityLogger.log(USER_EVENT_UNFOLLOWED_FEED, search.id, search);
        this._remove(search);
        this._loading();
        let callback = ((data) => this._onSearchUnfollowed(search, data)).bind(this);
        ZeeguuRequests.post(UNSUBSCRIBE_SEARCH_ENDPOINT, { search_id: search.id }, callback);
    }

    /**
     * A search has just been removed, so we remove the mentioned search from the subscription list.
     * On failure we notify the user.
     * Callback function for zeeguu.
     * @param {Object} search - Data of the particular search to that has been unfollowed.
     * @param {string} reply - Server reply.
     */
    _onSearchUnfollowed(search, reply) {
        if (reply === "OK") {
            this._changed();
        } else {
            Notifier.notify("Network Error - Could not unfollow " + search.search + ".");
            logger.push("Could not unfollow '" + search.search + "'. Server reply: \n" + reply);
        }
    }

    /**
     * Remove a mentioned language from the local list which is shown in the User Interface.
     * Makes sure the associated articles are removed as well by notifying {@link ArticleList}.
     * @param {Object} search - Data of the particular search to remove from the list.
     */
    _remove(search) {
        if (!this.searchList.delete(search.id)) { console.log("Error: search not in search list."); }
        $('span[searchRemovableID="' + search.id + '"]').fadeOut();
    }

    /**
     * Fire an event to notify change in this class.
     */
    _changed() {
        reload_articles_on_drawer_close();
    }

    /**
     * Fire event to show loader while subscribing / unsubscribing
     */
    _loading() {
        // document.dispatchEvent(new CustomEvent(config.EVENT_LOADING));
    }
};
