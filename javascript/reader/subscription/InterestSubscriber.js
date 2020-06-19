import $ from "jquery";
import Mustache from "mustache";
import swal from "sweetalert";
import UserActivityLogger from "../UserActivityLogger";
import ZeeguuRequests from "../zeeguuRequests";
import { GET_AVAILABLE_TOPICS, GET_SUBSCRIBED_TOPICS } from "../zeeguuRequests";

const HTML_ID_FEED_TEMPLATE = "#interests-template";
const USER_EVENT_OPENED_FEEDSUBSCRIBER = "OPEN TOPICSUBSCRIBER";
const INTERESTS = ".show-topic-subscriber";
const NON_INTERESTS = ".show-filter-subscriber";
const ALL_INTERESTS = ".tagsOfInterests";
const UNSUBSCRIBED_CLASS = "unsubscribed";
const INTEREST_BUTTON = ".interests";
const INTEREST_BUTTON_HTML = "interests";
const CUSTOM_INTEREST_BUTTON = "interests custom";
const ADD_CUSTOM_INTEREST = ".addInterestButton";
const CLOSE_BUTTON = ".closeTagsOfInterests";

let self;


/**
 * Allows the user to add and remove subscriptions.
 */
export default class InterestSubscriber {
  /**
   * Link the {@link InterestSubscriptionList} with this instance so we can update it on change.
   * @param interestSubscriptionList
   * @param customInterestSubscriptionList
   */
  constructor(interestSubscriptionList, customInterestSubscriptionList) {
    this.interestSubscriptionList = interestSubscriptionList;
    this.customInterestSubscriptionList = customInterestSubscriptionList;
    self = this;
  }

  /**
   * Open the dialog window containing the list of avaible and subscribed interests.
   */
  open() {
    UserActivityLogger.log(USER_EVENT_OPENED_FEEDSUBSCRIBER);
    document.querySelector(ALL_INTERESTS).style.display = "block";
    document.querySelector(NON_INTERESTS).disabled = true;
    this._makeCloseable();
    this._addInterest();
  }

  /**
   * Calls the two functions of the class that requests the available and subscribed interests.
   */
  load() {
    this.loadAvailable();
    this.loadSubscribed();
  }

  /**
   * Call Zeeguu and requests available interests.
   * Uses {@link ZeeguuRequests}.
   */
  loadAvailable() {
    ZeeguuRequests.get(
      GET_AVAILABLE_TOPICS,
      {},
      this._loadAvailableInterests.bind(this)
    );
  }

  /**
   * Call Zeeguu and requests subscribed interests.
   * Uses {@link ZeeguuRequests}.
   */
  loadSubscribed() {
    ZeeguuRequests.get(
      GET_SUBSCRIBED_TOPICS,
      {},
      this._loadSubscribedInterests.bind(this)
    );
  }

  /**
   * Fills the dialog's list with all the subscribed interests.
   * Click to subscribe or unsubscribe.
   * Callback function for zeeguu.
   * @param {Object[]} data - A list of topics the user have subscribe to.
   */
  _loadSubscribedInterests(data) {
    let template = $(HTML_ID_FEED_TEMPLATE).html();
    //this._addUnsubscribedClassName(template);
    //this._removeUnsubscribedClassNameFromCustom(template);
    for (let i = 0; i < data.length; i++) {
      let feedOption = $(Mustache.render(template, data[i]));
      let interest = $(feedOption.find(INTEREST_BUTTON));
      $(interest).addClass("interests");
      interest.click(
        (function (data, feedOption, interestSubscriptionList) {
          return function () {
            if ($(interest).hasClass(UNSUBSCRIBED_CLASS)) {
              interestSubscriptionList.follow(data);
              $(interest).removeClass(UNSUBSCRIBED_CLASS);
              console.log("subscribed");
            } else {
              interestSubscriptionList._unfollow(data);
              $(interest).addClass(UNSUBSCRIBED_CLASS);
              console.log("unsubscribed");
            }
          };
        })(data[i], feedOption, this.interestSubscriptionList)
      );
      this._appendInterest(template, feedOption);
    }
  }

  /**
   * Fills the dialog's list with all the available interests.
   * Click to subscribe or unsubscribe
   * Callback function for zeeguu.
   * @param {Object[]} data - A list of topics the user can subscribe to.
   */
  _loadAvailableInterests(data) {
    let template = $(HTML_ID_FEED_TEMPLATE).html();
    //this._addUnsubscribedClassName(template);
    //this._removeUnsubscribedClassNameFromCustom(template);
    for (let i = 0; i < data.length; i++) {
      let feedOption = $(Mustache.render(template, data[i]));
      let interest = $(feedOption.find(INTEREST_BUTTON));
      $(interest).addClass(UNSUBSCRIBED_CLASS);
      interest.click(
        (function (data, feedOption, interestSubscriptionList) {
          return function () {
            if ($(interest).hasClass(UNSUBSCRIBED_CLASS)) {
              interestSubscriptionList.follow(data);
              $(interest).removeClass(UNSUBSCRIBED_CLASS);
              console.log("subscribed");
            } else {
              interestSubscriptionList._unfollow(data);
              $(interest).addClass(UNSUBSCRIBED_CLASS);
              console.log("unsubscribed");
            }
          };
        })(data[i], feedOption, this.interestSubscriptionList)
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

  _addInterest() {
    let addCustomInterest = document.querySelector(ADD_CUSTOM_INTEREST);
    $(addCustomInterest).click(function () {
      swal.close();
      setTimeout(function () {
        swal(
          {
            title: "Add a personal interst!",
            type: "input",
            inputPlaceholder: "interest",
            allowOutsideClick: true,
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonColor: "#ffbb54",
            confirmButtonText: "Add",
            cancelButtonText: "Close"
          },
          function (input) {
            if (input === "" || input === false) {
              return false;
            }
            self.customInterestSubscriptionList.follow(input);
          }
        );
      }, 150);
    });
  }

  _makeCloseable() {
    let closeInterests = document.querySelector(INTERESTS);
    $(closeInterests).click(function () {
      document.querySelector(ALL_INTERESTS).style.display = "none";
      location.reload();
    });

    let closeInterestsButton = document.querySelector(CLOSE_BUTTON);
    $(closeInterestsButton).click(function () {
      document.querySelector(ALL_INTERESTS).style.display = "none";
      location.reload();
    });
  }
}
