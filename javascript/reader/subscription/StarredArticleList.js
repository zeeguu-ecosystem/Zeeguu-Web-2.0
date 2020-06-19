import $ from 'jquery';
import Mustache from 'mustache';
import config from '../config';
import UserActivityLogger from '../UserActivityLogger';
import ZeeguuRequests from '../zeeguuRequests';
import { GET_STARRED_ARTICLES } from '../zeeguuRequests';
import { POST_UNSTAR_ARTICLE } from '../zeeguuRequests';


const HTML_ID_EMPTY_STARRED_ARTICLE_LIST = '#emptyStarredArticleListImage';
const HTML_ID_STARRED_ARTICLE_LIST = '#starredArticleList';
const HTML_ID_STARRED_ARTICLELINK_TEMPLATE = '#starred-articleLink-template';
const HTML_CLASS_CLEAR = '.clear';
const USER_EVENT_CLICKED_ARTICLE = 'OPEN STARRED ARTICLE';

/**
 * Retrieves and renders a list of starred articles.
 */
export default class StarredArticleList {
    /**
     * Make an asynchronous call using {@link ZeeguuRequests} to retrieve the starred articles.
     */
    load() {
        ZeeguuRequests.get(GET_STARRED_ARTICLES, {}, this._renderArticleLinks);
    }

    /**
     * Build a list of articles.
     * Shares code with the {@link ArticleList} class,
     * and thus its a bit smelly.
     * @param {Object[]} articleLinks - List containing articles.
     */
    _renderArticleLinks(articleLinks) {
        if (articleLinks.length === 0) {
            $(HTML_ID_EMPTY_STARRED_ARTICLE_LIST).show();
            return;
        }
        $(HTML_ID_EMPTY_STARRED_ARTICLE_LIST).hide();

        let template = $(HTML_ID_STARRED_ARTICLELINK_TEMPLATE).html();
        for (let i = articleLinks.length - 1; i >= 0; i--) {
            let articleLink = articleLinks[i];
            let difficulty = Math.round(parseFloat(articleLink.metrics.difficulty) * 100) / 10;
            let topicsList = articleLink.topics.trim().split(" ");
            let topicsListDict = [];
            for (let i = 0; i < topicsList.length; i++) {
                if (topicsList[i] != "") {
                    topicsListDict.push({ "topic": topicsList[i] });
                }
            }


            // In case we don't have an articleLink url let's point to a fancy letter
            // that matches the initials of the author

            var articleIconURL;
            if (articleLink.icon_name) {
                articleIconURL = "/read/static/images/news-icons/" + articleLink.icon_name;
            } else {
                let authorsInitial = articleLink.authors[0].toLowerCase();
                articleIconURL = "https://img.icons8.com/dusk/2x/" + authorsInitial + ".png";
            }


            let templateAttributes = {
                articleLinkID: articleLink.id,
                articleLinkTitle: articleLink.title,
                articleLinkLanguage: articleLink.language,
                articleLinkURL: articleLink.url,
                articleLinkDisplayStar: articleLink.starred ? "inline" : "none",
                articleLinkDisplayLike: articleLink.liked ? "inline" : "none",
                articleIcon: articleIconURL,
                articleDifficulty: difficulty,
                articleTopics: topicsListDict,
                articleSummary: $('<p>' + articleLink.summary + '</p>').text(),
                wordCount: articleLink.metrics.word_count


            };

            let element = Mustache.render(template, templateAttributes);


            $(HTML_ID_STARRED_ARTICLE_LIST).append(element);
        }

        $(HTML_CLASS_CLEAR).on('click', function () {
            ZeeguuRequests.post(POST_UNSTAR_ARTICLE, { url: this.dataset.href });
            $(this).parent().parent().fadeOut(200, function () {
                let remaining = ($(this).siblings(config.HTML_CLASS_ARTICLELINK_ENTRY)).length;
                if (remaining === 0)
                    $(HTML_ID_EMPTY_STARRED_ARTICLE_LIST).show();
                $(this).remove();
            });
        });
    }
}
