import $ from 'jquery'
import config from '../config';
import Notifier from '../Notifier';
import 'loggly-jslogger';
import UserActivityLogger from '../UserActivityLogger';
import ZeeguuRequests from '../zeeguuRequests';
import { GET_SUBSCRIBED_TOPICS } from '../zeeguuRequests';
import { SUBSCRIBE_TOPIC_ENDPOINT } from '../zeeguuRequests';
import { UNSUBSCRIBE_TOPIC_ENDPOINT } from '../zeeguuRequests';
import { reload_articles_on_drawer_close } from './main.js';


const HTML_ID_SUBSCRIPTION_LIST = '#topicsList';
const HTML_ID_NO_TOPIC_SELECTED = '#any_topic';
const USER_EVENT_FOLLOWED_FEED = 'FOLLOW FEED';
const USER_EVENT_UNFOLLOWED_FEED = 'UNFOLLOW FEED';

/* Setup remote logging. */
let logger = new LogglyTracker();
logger.push({
    'logglyKey': config.LOGGLY_TOKEN,
    'sendConsoleErrors': true,
    'tag': 'TopicSubscriptionList'
});

/**
 * Shows a list of all subscribed topics, allows the user to remove them.
 * It updates the {@link ArticleList} accordingly.
 */
export default class InterestSubscriptionList {
    /**
     * Initialise an empty {@link Map} of topics.
     */
    constructor() {
        this.topicList = new Map();
    }

    /**
     *  Call zeeguu and retrieve all currently subscribed topics.
     *  Uses {@link ZeeguuRequests}.
     */
    load() {
        ZeeguuRequests.get(GET_SUBSCRIBED_TOPICS, {}, this._loadSubscriptions.bind(this));
        this.show_no_topic_message_if_necessary();
    };

    /**
     * Remove all topics from the list, clear {@link ArticleList} as well.
     */
    clear() {
        $(HTML_ID_SUBSCRIPTION_LIST).empty();
    };

    /**
     * Call clear and load successively.
     */
    refresh() {
        // Refresh the topic list.
        this.clear();
        this.load();
    };

    /**
     * Fills the subscription list with all the subscribed topics.
     * Callback function for the zeeguu request,
     * makes a call to {@link ArticleList} in order to load the topic's associated articles.
     * @param {Object[]} data - List containing the topics the user is subscribed to.
     */
    _loadSubscriptions(data) {
        for (let i = 0; i < data.length; i++) {
            this._addSubscription(data[i]);
        }
    }

    /**
     * Add the topic to the list of subscribed topics.
     * @param {Object} topic - Data of the particular topic to add to the list.
     */
    _addSubscription(topic) {
        if (this.topicList.has(topic.id))
            return;
        this.topicList.set(topic.id, topic);
        this.show_no_topic_message_if_necessary();
    }

    show_no_topic_message_if_necessary() {
        if (this.topicList.size > 0) {
            $(HTML_ID_NO_TOPIC_SELECTED).hide();
        } else {
            $(HTML_ID_NO_TOPIC_SELECTED).show();
        }
    }

    /**
     * Subscribe to a new topic, calls the zeeguu server.
     * Uses {@link ZeeguuRequests}.
     * @param {Object} topic - Data of the particular topic to subscribe to.
     */
    follow(topic) {
        UserActivityLogger.log(USER_EVENT_FOLLOWED_FEED, topic.id, topic);
        this._addSubscription(topic);
        this._loading();
        let callback = ((data) => this._onTopicFollowed(topic, data)).bind(this);
        ZeeguuRequests.post(SUBSCRIBE_TOPIC_ENDPOINT, { topic_id: topic.id }, callback);
    }

    /**
     * A topic has just been followed, so we call the {@link ArticleList} to update its list of articles.
     * If there was a failure to follow the topic, we notify the user.
     * Callback function for Zeeguu.
     * @param {Object} topic - Data of the particular topic that has been subscribed to.
     * @param {string} reply - Reply from the server.
     */
    _onTopicFollowed(topic, reply) {
        if (reply === "OK") {
            this._changed();
        } else {
            Notifier.notify("Network Error - Could not follow " + topic.title + ".");
            logger.push("Could not follow '" + topic.title + "'. Server reply: \n" + reply);
        }
    }

    /**
     * Un-subscribe from a topic, call the zeeguu server.
     * Uses {@link ZeeguuRequests}.
     * @param {Object} topic - Data of the particular topic to unfollow.
     */
    _unfollow(topic) {
        UserActivityLogger.log(USER_EVENT_UNFOLLOWED_FEED, topic.id, topic);
        this._remove(topic);
        this._loading();
        let callback = ((data) => this._onTopicUnfollowed(topic, data)).bind(this);
        ZeeguuRequests.post(UNSUBSCRIBE_TOPIC_ENDPOINT, { topic_id: topic.id }, callback);
    }

    /**
     * A topic has just been removed, so we remove the mentioned topic from the subscription list.
     * On failure we notify the user.
     * Callback function for zeeguu.
     * @param {Object} topic - Data of the particular topic to that has been unfollowed.
     * @param {string} reply - Server reply.
     */
    _onTopicUnfollowed(topic, reply) {
        if (reply === "OK") {
            this._changed();
            this.show_no_topic_message_if_necessary();
        } else {
            Notifier.notify("Network Error - Could not unfollow " + topic.title + ".");
            logger.push("Could not unfollow '" + topic.title + "'. Server reply: \n" + reply);
        }
    }

    /**
     * Remove a mentioned language from the local list which is shown in the User Interface.
     * Makes sure the associated articles are removed as well by notifying {@link ArticleList}.
     * @param {Object} topic - Data of the particular topic to remove from the list.
     */
    _remove(topic) {
        if (!this.topicList.delete(topic.id)) {
            console.log("Error: topic not in topic list.");
        }
        $('span[topicRemovableID="' + topic.id + '"]').fadeOut();
    }

    /**
     * Fire an event to notify change in this class.
     */
    _changed() {
        reload_articles_on_drawer_close();
    }

    /**
     * Was used to fire event to show loader while subscribing / unsubscribing
     * Not doing anything anymore because we're not reloading anymore
     */
    _loading() {

    }
};
