import $ from "jquery";
import Mustache from "mustache";
import config from "../config";
import moment from "moment";
import { difficultyToColorMapping } from "./DifficultyColors";
import UserActivityLogger from "../UserActivityLogger";
import ZeeguuRequests from "../zeeguuRequests";
import { GET_COHORT_ARTICLES } from "../zeeguuRequests";
import {select_tab} from './headerMenu';

const HTML_ID_EMPTY_COHORT_ARTICLE_LIST = "#emptyCohortArticleListImage";
const HTML_ID_COHORT_ARTICLE_LIST = "#cohortArticleList";
const HTML_ID_COHORT_ARTICLELINK_TEMPLATE = "#cohort-articleLink-template";
const HTML_CLASS_CLEAR = ".clear";
const USER_EVENT_CLICKED_ARTICLE = "OPEN COHORT ARTICLE";

/**
 * Retrieves and renders a list of cohort articles.
 */
export default class CohortArticleList {
  /**
   * Make an asynchronous call using {@link ZeeguuRequests} to retrieve the cohort articles.
   */
  load() {
    ZeeguuRequests.get(GET_COHORT_ARTICLES, {}, this._renderArticleLinks);
    select_tab("#cohort_tab")
  }

  /**
   * Build a list of articles.
   * Shares code with the {@link ArticleList} class,
   * and thus its a bit smelly.
   * @param {Object[]} articleLinks - List containing articles.
   */

  renderNoArticlesICON() {
    $(HTML_ID_EMPTY_COHORT_ARTICLE_LIST).show();
  }

  _renderArticleLinks(articleLinks) {

    console.log("got cohort articles...");
    console.log(articleLinks);


    if (articleLinks.length === 0) {
      setTimeout(this.renderNoArticlesICON, 1000);
      return;
    }
    $(HTML_ID_EMPTY_COHORT_ARTICLE_LIST).hide();

    let template = $(HTML_ID_COHORT_ARTICLELINK_TEMPLATE).html();
    for (let i = articleLinks.length - 1; i >= 0; i--) {
      let articleLink = articleLinks[i];
      var publishedString = moment.utc(articleLink.published).fromNow();
      let difficulty =
        Math.round(parseFloat(articleLink.metrics.difficulty) * 100) / 10;
      let topicsText = articleLink.topics.trim().replace(/(^|\s+)/g, "$1#");
      if (topicsText == "#") topicsText = "";

      let templateAttributes = {
        articleLinkID: articleLink.id,
        articleLinkPublished: publishedString,
        articleLinkTitle: articleLink.title,
        articleLinkURL: articleLink.url,
        articleLinkFeedID: articleLink.feedId,
        articleLinkLanguage: articleLink.language,
        articleDifficulty: difficulty,
        articleDifficultyColor: difficultyToColorMapping(difficulty),
        articleSummary: $("<p>" + articleLink.summary + "</p>").text(),
        articleIcon: articleLink.feed_image_url,
        articleTopics: topicsText,
        wordCount: articleLink.metrics.word_count,
        alreadyOpenedClass: articleLink.opened
          ? ALREADY_OPENED_ARTICLE_CLASS
          : "",
      };

      let element = Mustache.render(template, templateAttributes);

      $(HTML_ID_COHORT_ARTICLE_LIST).append(element);
    }
  }
}
