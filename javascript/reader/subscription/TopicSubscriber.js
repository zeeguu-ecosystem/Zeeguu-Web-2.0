import $ from "jquery";
import Mustache from "mustache";
import config from "../config";
import swal from "sweetalert";
import UserActivityLogger from "../UserActivityLogger";
import ZeeguuRequests from "../zeeguuRequests";
import { GET_AVAILABLE_TOPICS, GET_SUBSCRIBED_TOPICS } from "../zeeguuRequests";
import { take_keyboard_focus_away_from_article_list } from "./main.js";

const HTML_ID_ADD_FEED_LIST = "#addableTopicList";
const HTML_ID_FEED_TEMPLATE = "#topicAddable-template";
const USER_EVENT_OPENED_FEEDSUBSCRIBER = "OPEN TOPICSUBSCRIBER";
const UNSUBSCRIBED_CLASS = "unsubscribed"
const INTEREST_BUTTON = ".mdl-chip__action.interests";
const INTEREST_BUTTON_HTML = "mdl-chip__action interests";
const CUSTOM_INTEREST_BUTTON = "mdl-chip__action interests custom";
const ALL_INTERESTS = ".tagsOfInterests";
let self;

/**
 * Allows the user to add topic subscriptions.
 */
export default class TopicSubscriber {
  /**
   * Link the {@link TopicSubscriptionList} with this instance so we can update it on change.
   * @param topicSubscriptionList
   * @param searchSubscriptionList
   */
  constructor(topicSubscriptionList, searchSubscriptionList) {
    console.log("topic subscriber...");

    this.topicSubscriptionList = topicSubscriptionList;
    this.searchSubscriptionList = searchSubscriptionList;
    self = this;
  }

  /**
   * Open the dialog window containing the list of topics.
   * Uses the sweetalert library.
   */
  open() {
    UserActivityLogger.log(USER_EVENT_OPENED_FEEDSUBSCRIBER);
    this.showBlockOfInterests();

    let addCustomInterest = document.querySelector('.addInterestButton');
    $(addCustomInterest).click(function () {
      swal.close();
      setTimeout(function () {
        swal({
          title: 'Add a personal interst!',
          type: 'input',
          inputPlaceholder: "interest",
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
          self.searchSubscriptionList.follow(input);
        })
      }, 150);
    });

    let closeInterestsButton = document.querySelector('.closeTagsOfInterests');
    $(closeInterestsButton).click(function () {
      var blockOfTopics = document.querySelector(ALL_INTERESTS);
      blockOfTopics.style.display = "none";
    });
  }

  /**
   * Call Zeeguu and requests available topics.
   */
  loadAvailable() {
    ZeeguuRequests.get(
      GET_AVAILABLE_TOPICS,
      {},
      this._loadAvailableInterests.bind(this)
    );
  }

  /**
  * Call Zeeguu and requests subscribed topics.
  */
  loadSubscribed() {
    ZeeguuRequests.get(
      GET_SUBSCRIBED_TOPICS,
      {},
      this._loadSubscribedInterests.bind(this),
    );
  }

  /**
   * Clear the list of feed options.
   */
  clear() {
    $(HTML_ID_ADD_FEED_LIST).empty();
  }



  showBlockOfInterests() {
    var blockOfTopics = document.querySelector(ALL_INTERESTS);
    if (blockOfTopics.style.display === "block") {
      blockOfTopics.style.display = "none";
    } else {
      blockOfTopics.style.display = "block";
    }
  }

  /**
   * Fills the dialog's list with all the subscribed topics.
   * Click to subscribe or unsubscribe.
   * Callback function for zeeguu.
   * @param {Object[]} data - A list of topics the user have subscribe to.
   */
  _loadSubscribedInterests(data) {
    let template = $(HTML_ID_FEED_TEMPLATE).html();
    this._addUnsubscribedClassName(template);
    this._removeUnsubscribedClassNameFromCustom(template);
    for (let i = 0; i < data.length; i++) {
      let feedOption = $(Mustache.render(template, data[i]));
      let topic = $(feedOption.find(INTEREST_BUTTON));
      topic.click(
        (function (data, feedOption, topicSubscriptionList) {
          return function () {
            if ($(topic).hasClass(UNSUBSCRIBED_CLASS)) {
              topicSubscriptionList.follow(data);
              $(topic).removeClass(UNSUBSCRIBED_CLASS);
              console.log("subscribed");
            }
            else {
              topicSubscriptionList._unfollow(data);
              $(topic).addClass(UNSUBSCRIBED_CLASS);
              console.log("unsubscribed");
            }
          }
        })(data[i], feedOption, this.topicSubscriptionList)
      );
      this._appendInterest(template, feedOption);
    }
    this._appendAddButton(template);
  }



  /**
   * Fills the dialog's list with all the unsubscribed topics.
   * Click to subscribe or unsubscribe
   * Callback function for zeeguu.
   * @param {Object[]} data - A list of topics the user can subscribe to.
   */
  _loadAvailableInterests(data) {
    let template = $(HTML_ID_FEED_TEMPLATE).html();
    for (let i = 0; i < data.length; i++) {
      let feedOption = $(Mustache.render(template, data[i]));
      let topic = $(feedOption.find(INTEREST_BUTTON));
      topic.click(
        (function (data, feedOption, topicSubscriptionList) {
          return function () {
            if ($(topic).hasClass(UNSUBSCRIBED_CLASS)) {
              topicSubscriptionList.follow(data);
              $(topic).removeClass(UNSUBSCRIBED_CLASS);
              console.log("subscribed");
            } else {
              topicSubscriptionList._unfollow(data);
              $(topic).addClass(UNSUBSCRIBED_CLASS);
              console.log("unsubscribed");
            }
          };
        })(data[i], feedOption, this.topicSubscriptionList)
      );
      this._appendInterest(template, feedOption);
    }
  }

  _addUnsubscribedClassName(template) {
    let unsubscribed = document.getElementsByClassName(INTEREST_BUTTON_HTML);
    $(unsubscribed).addClass(UNSUBSCRIBED_CLASS);
  }

  _removeUnsubscribedClassNameFromCustom(template) {
    let custom = document.getElementsByClassName(CUSTOM_INTEREST_BUTTON);
    $(custom).removeClass(UNSUBSCRIBED_CLASS);
  }

  _appendInterest(template, feedOption) {
    $(ALL_INTERESTS).append(feedOption);
  }
}



/*

 if ($(topic).hasClass("custom") && !$(topic).hasClass(UNSUBSCRIBED_CLASS)) {
    searchSubscriptionList._unfollow(data);
    console.log("removed");
  }

    for (let i = 0; i < data.length; i++) {
      let feedOption = $(Mustache.render(template, data[i]));
      let subscribeButton = $(feedOption.find(HTML_CLASS_SUBSCRIBE_BUTTON));

      subscribeButton.click(
        (function(data, feedOption, topicSubscriptionList) {
          return function() {
            topicSubscriptionList.follow(data);
            $(feedOption).fadeOut();
          };
        })(data[i], feedOption, this.topicSubscriptionList)
      );

      let feedIcon = $(feedOption.find(HTML_CLASS_FEED_ICON));
      feedIcon.on("error", function() {
        $(this)
          .unbind("error")
          .attr("src", "static/images/noAvatar.png");
      });
      $(HTML_ID_ADD_FEED_LIST).append(feedOption);
      console.log("4");
    }
*/
