import $ from "jquery";
import UserActivityLogger from "../UserActivityLogger";

const HTML_ID_EMPTY_ARTICLE_LIST = "#emptyArticleListImage";
const HTML_CLASS_TOUR = ".tour";
const HTML_CLASS_NAME_WIGGLE = "wiggle";
const USER_EVENT_SHOW = "NO-FEED-TOUR SHOWN";

/**
 * Shows or hides style for when there is no feed.
 */
export default class NoFeedTour {
  /**
   * Show a tour styling, guiding the user to new feeds.
   */
  show() {
    UserActivityLogger.log(USER_EVENT_SHOW);
    $(HTML_ID_EMPTY_ARTICLE_LIST).show();
    $(HTML_CLASS_TOUR).addClass(HTML_CLASS_NAME_WIGGLE);
  }

  /**
   * Hides the tour styling.
   */
  hide() {
    $(HTML_ID_EMPTY_ARTICLE_LIST).hide();
    $(HTML_CLASS_TOUR).removeClass(HTML_CLASS_NAME_WIGGLE);
  }
}

// KAY: I'M NOT SURE IF WE'RE USING THIS!
