/* Script that binds listeners to html events, such that the
 * correct object is called to handle it. */

import $ from "jquery";
import config from "../config";
import Mustache from "mustache";

import Translator from "./Translator";
import AlterMenu from "./AlterMenu";
import Speaker from "./Speaker";
import Bookmarker from "./Bookmarker";
import UserActivityLogger from "../UserActivityLogger";
import { readCookie } from "../cookieWorks";
import {
  addParagraphs,
  filterShit,
  wrapWordsInZeeguuTags
} from "./textProcessing";
import { get_article_id } from "./article_id.js";

import { GET_USER_ARTICLE_INFO, BOOKMARKS_FOR_ARTICLE, DELETE_BOOKMARK } from "../zeeguuRequests";
import ZeeguuRequests from "../zeeguuRequests";

// import "../../../styles/mdl/material.min.js";
//import "../../../styles/mdl/material.min.css";
import "../styles/article.css";
import "../styles/material-icons.css";

const USER_EVENT_CHANGE_ORIENTATION = "CHANGE ORIENTATION";
const USER_EVENT_LIKE_ARTICLE = "LIKE ARTICLE";
const USER_EVENT_UNLIKE_ARTICLE = "UNLIKE ARTICLE";
const USER_EVENT_EXIT_ARTICLE = "ARTICLE CLOSED";
const USER_EVENT_OPEN_VOCABULARY_FOR_ARTICLE = "OPEN ARTICLE VOCABULARY";
const USER_EVENT_OPENED_ARTICLE = "OPEN ARTICLE";
const USER_EVENT_ARTICLE_FOCUS = "ARTICLE FOCUSED";
const USER_EVENT_ARTICLE_LOST_FOCUS = "ARTICLE LOST FOCUS";
const USER_EVENT_SCROLL = "SCROLL";

const HTML_ID_TOGGLE_UNDO = "#toggle_undo";
const HTML_ID_TOGGLE_TRANSLATE = "#toggle_translate";
const HTML_ID_TOGGLE_LISTEN = "#toggle_listen";
const HTML_ID_TOOGLE_BOOKMARK = "#bookmark_button";
const HTML_ID_ENJOYED_READING = "#enjoyedButton";
const HTML_ID_REVIEW_WORDS = "#reviewButton";
const HTML_ID_ARTICLE_VOCABULARY_LINK = "#bookmarks_for_article_link";
const CLASS_NOSELECT = "noselect";
const ENTER_KEY = 13;

var bookmarker;
const speaker = new Speaker();

let translator;
let alterMenu;
let FROM_LANGUAGE;

let previous_time = 0;

let FREQUENCY_KEEPALIVE = 60 * 1000;

const ARTICLE_FEEDBACK_BUTTON_IDS = [
  "#not_finished_for_boring",
  "#not_finished_for_too_long",
  "#not_finished_for_too_difficult",
  "#not_finished_for_broken",
  "#not_finished_for_incomplete",
  "#not_finished_for_other"
];

const ARTICLE_DIFFICULTY_BUTTON_IDS = [
  "#finished_easy",
  "#finished_ok",
  "#finished_hard",
  "#finished_very_hard"
];

/* When the document has finished loading,
 * bind all necessary listeners. */
$(document).ready(function () {
  getArticleInfoAndInitElementsRequiringIt(get_article_id());
  UserActivityLogger.log_article_interaction(USER_EVENT_OPENED_ARTICLE);
});

function getArticleInfoAndInitElementsRequiringIt(article_id) {
  let TO_LANGUAGE = readCookie("native_lang");

  ZeeguuRequests.get(
    GET_USER_ARTICLE_INFO,
    { article_id: article_id },
    function (article_info) {
      FROM_LANGUAGE = article_info.language;

      translator = new Translator(FROM_LANGUAGE, TO_LANGUAGE);

      alterMenu = new AlterMenu(FROM_LANGUAGE, TO_LANGUAGE);

      load_article_info_in_page(article_info);

      attachInteractionScripts();

      make_article_elements_visible();

    }.bind(this)
  );

}

function attachInteractionScripts() {
  disableToggleCopy();
  $(HTML_ID_TOGGLE_TRANSLATE).addClass("selected");
  attachZeeguuTagListeners();

  /* When the user leaves the article, log it as an event. */
  window.onbeforeunload = log_user_leaves_article;

  /* When translate is clicked, user can click on words to translate .
   * Default option
   */
  $(HTML_ID_TOGGLE_TRANSLATE).click(handle_TOGGLE_TRANSLATE_click);

  /* When listen is clicked, user can click on words to hear
   * pronounciation.
   */
  $(HTML_ID_TOGGLE_LISTEN).click(handle_TOGGLE_LISTEN_click);

  /* When undo is clicked, content page is replaced
   * with previous one in the stack and listeners are re-attached.
   */
  $(HTML_ID_TOGGLE_UNDO).click(handle_TOGGLE_UNDO_click);

  $(HTML_ID_ENJOYED_READING).click(handle_ENJOYED_READING_click);

  $(HTML_ID_REVIEW_WORDS).click(handle_REVIEW_WORDS_click);

  /* Toggle listener for bookmark button. */
  $(HTML_ID_TOOGLE_BOOKMARK).click(function () {
    bookmarker.toggle();
  });

  $(HTML_ID_ARTICLE_VOCABULARY_LINK).click(function () {
    UserActivityLogger.log_article_interaction(
      USER_EVENT_OPEN_VOCABULARY_FOR_ARTICLE
    );
  });

  $(".articlesMainContainer").on("scroll", handle_CONTENT_SCROLL_EVENT);

}

function log_user_leaves_article() {
  UserActivityLogger.log_article_interaction(USER_EVENT_EXIT_ARTICLE);
}

function handle_TOGGLE_TRANSLATE_click() {
  $(HTML_ID_TOGGLE_UNDO).removeClass("selected");
  $(HTML_ID_TOGGLE_LISTEN).removeClass("selected");
  $(this).addClass("selected");
}

function handle_TOGGLE_LISTEN_click() {
  if ($(this).hasClass("selected")) {
    $(this).removeClass("selected");
    $(HTML_ID_TOGGLE_TRANSLATE).addClass("selected");
  } else {
    $(HTML_ID_TOGGLE_UNDO).removeClass("selected");
    $(HTML_ID_TOGGLE_TRANSLATE).removeClass("selected");
    $(this).addClass("selected");
  }
}

function handle_TOGGLE_UNDO_click() {
  if (alterMenu.isOpen()) {
    alterMenu.close();
    $(this).removeClass("selected");
    return;
  }
  $(HTML_ID_TOGGLE_TRANSLATE).removeClass("selected");
  $(HTML_ID_TOGGLE_LISTEN).removeClass("selected");
  $(this).addClass("selected");
  $(config.HTML_ZEEGUUTAG).off();
  translator.undoTranslate();
  attachZeeguuTagListeners();
}

function handle_ENJOYED_READING_click() {
  var modal = document.getElementById("modalEnjoyed");
  modal.style.display = "block";

  var yes = document.getElementsByClassName("modalButton yes")[0];
  yes.onclick = function () {
    UserActivityLogger.log_article_interaction(USER_EVENT_LIKE_ARTICLE);
    modal.style.display = "none";
    document.getElementById("toolbarContainer").style.display = "flex";
    document.getElementById("arrow-p").style.display = "block";
  }

  var no = document.getElementsByClassName("modalButton no")[0];
  no.onclick = function () {
    UserActivityLogger.log_article_interaction(USER_EVENT_UNLIKE_ARTICLE);
    modal.style.display = "none";
    document.getElementById("toolbarContainer").style.display = "flex";
    document.getElementById("arrow-p").style.display = "block";
  }

  var close = document.getElementById("closeEnjoyed");
  close.onclick = function () {
    modal.style.display = "none";
    document.getElementById("toolbarContainer").style.display = "flex";
    document.getElementById("arrow-p").style.display = "block";
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}

function handle_REVIEW_WORDS_click() {
  var modal = document.getElementById("modalReview");
  modal.style.display = "block";

  var articleId = document.getElementById("articleID").innerText;
  ZeeguuRequests.post(BOOKMARKS_FOR_ARTICLE + "/" + articleId, {}, function (data) {
    let template = $("#translatedwords-template").html();
    for (var i = 0; i < data.bookmarks.length; i++) {
      let feedOption = $(Mustache.render(template, data.bookmarks[i]));
      let deleteTrash = $(feedOption.find(".trash"));
      deleteTrash.click(
        (function (data, feedOption) {
          return function () {
            console.log(feedOption);
            console.log(data.id);
            var translationId = data.id;
            console.log(translationId);
            ZeeguuRequests.post(DELETE_BOOKMARK + "/" + translationId, {},
              function (data) {
                feedOption.fadeOut();
                return false;
              }
            )
          }
        })(data.bookmarks[i], feedOption)
      );
      $("#wordList").append(feedOption);
    }
  });

  var close = document.getElementById("closeReview");
  close.onclick = function () {
    modal.style.display = "none";
    document.getElementById("toolbarContainer").style.display = "flex";
    document.getElementById("arrow-p").style.display = "block";
    $("#wordList").children().remove();
  }

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
      $("#wordList").children().remove();
    }
  }
}

function handle_CONTENT_SCROLL_EVENT() {
  let _current_time = new Date();
  let current_time = _current_time.getTime();
  if (previous_time == 0) {
    UserActivityLogger.log_article_interaction(USER_EVENT_SCROLL);
    previous_time = current_time;
  } else {
    if (current_time - previous_time > FREQUENCY_KEEPALIVE) {
      UserActivityLogger.log_article_interaction(USER_EVENT_SCROLL);
      previous_time = current_time;
    } else {
    }
  }
}

/* Clicking anywhere in the document when the
 * alter menu is open, except for the input field,
 * will close the alter menu.
 */
$(document).click(function (event) {
  let $target = $(event.target);
  if (!$target.is('input') && alterMenu.isOpen()) {
    alterMenu.close();
  } else if ($target.is('input') && $target.val() === config.TEXT_SUGGESTION) {
    $target.attr('value', '');
  }
});

/* Listens on keypress 'enter' to set the user suggestion
 * as the chosen translation and sends the user's contribution
 * to Zeeguu. */
$(document).keypress(function (event) {
  let $target = $(event.target);
  if ($target.is("input") && event.which === ENTER_KEY) {
    let $zeeguu = $target.closest(config.HTML_ZEEGUUTAG);
    let $trans = $zeeguu.children(config.HTML_TRANSLATED);
    if ($target.val() !== "") {
      $trans.attr(config.HTML_ATTRIBUTE_CHOSEN, $target.val());
      $trans.attr(config.HTML_ATTRIBUTE_SUGGESTION, $target.val());
      //$trans.children(config.HTML_TAG__MORE_ALTERNATIVES).remove();
      $trans.children(config.HTML_TAG__MORE_ALTERNATIVES).removeClass();
      $trans.children(config.HTML_TAG__SINGLE_ALTERNATIVE).removeClass();
      $trans
        .children(config.HTML_TAG__MORE_ALTERNATIVES)
        .addClass("handContributed");
      $trans
        .children(config.HTML_TAG__SINGLE_ALTERNATIVE)
        .addClass("handContributed");
      $trans.addClass("contributedAlternativeTran");
      $trans
        .parent()
        .children("orig")
        .addClass("contributedAlternativeOrig");
      translator.sendSuggestion($zeeguu);
    }
    alterMenu.close();
  }
});

/* Every time the screen orientation changes,
 * the alter menu will be closed. */
$(window).on("orientationchange", function () {
  alterMenu.close();
  UserActivityLogger.log_article_interaction(USER_EVENT_CHANGE_ORIENTATION);
});

$(window).on("focus", function () {
  UserActivityLogger.log_article_interaction(USER_EVENT_ARTICLE_FOCUS);
});

$(window).on("blur", function () {
  UserActivityLogger.log_article_interaction(USER_EVENT_ARTICLE_LOST_FOCUS);
});


function disableToggleCopy() {
  $("p").each(function () {
    $(this).addClass(CLASS_NOSELECT);
  });
}

function load_article_info_in_page(article_info) {
  // TITLE
  let title_text = article_info.title;
  document.title = title_text;
  title_text = wrapWordsInZeeguuTags(title_text);
  $("#articleTitle").html(title_text);

  // AUTHORS
  $("#authors").text(article_info.authors);

  // LINK TO SOURCE
  $("#source").attr("href", article_info.url);

  // CONTENT
  let text = article_info.content;
  text = filterShit(text);
  text = wrapWordsInZeeguuTags(text);
  text = addParagraphs(text);
  $("#articleContent").html(text);

  bookmarker = new Bookmarker(article_info.starred);
}

function make_article_elements_visible() {
  // These things have to be hidden
  // initially since otherwise they
  // stand out while we wait for the
  // text to arrive from the server.
  // But now that the text is in, we
  // can show them.

  $("#header_row").css("visibility", "visible");
  $("#main_article_content").css("visibility", "visible");
  $("#bottom_feedback_div").css("visibility", "visible");
  $(HTML_ID_ENJOYED_READING).css("visibility", "visible");
  $(HTML_ID_REVIEW_WORDS).css("visibility", "visible");
  $("#loaderanimation").hide();
}

/* Attach Zeeguu tag click listener. */
function attachZeeguuTagListeners() {
  /* When a translatable word has been clicked,
   * either try to translate it, speak it, or open an alternative
   * translation window.  */
  $(config.HTML_ZEEGUUTAG).click(function (event) {
    if (alterMenu.isOpen()) return;
    // If listen is selected we pronounce it using the speaker
    if ($(HTML_ID_TOGGLE_LISTEN).hasClass("selected")) {
      let $target = $(event.target);
      speaker.speak($target.text(), FROM_LANGUAGE);
    } else {
      let $target = $(event.target);
      if (
        $target.is(config.HTML_ZEEGUUTAG) &&
        !translator.isTranslated($target)
      ) {
        // A non-translated word is clicked, so we translate it.
        translator.getTopTranslation(this);
        // NOTE: To fall back to the previous version uncomment the following line
        // and comment the above line.
        // translator.translate(this);
      } else if ($target.is(config.HTML_TRANSLATED)) {
        // Translated text is clicked, so we open the alterMenu to allow for suggestions.
        let getAllTranslations =
          $target.attr(config.HTML_ATTRIBUTE_POSSIBLY_MORE_TRANSLATIONS) === "";
        if (getAllTranslations) {
          let currentService = $target.attr(
            config.HTML_ATTRIBUTE_SERVICENAME_TRANSLATION + "0"
          );
          let currentTranslation = $target.attr(
            config.HTML_ATTRIBUTE_TRANSLATION + "0"
          );
          // Fetch the rest of the translations. Passing the alterMenu variable to automatically
          // build and show the alterMenu via the callback once the next translations are fetched.
          translator.getNextTranslations(
            this,
            currentService,
            currentTranslation,
            alterMenu,
            $target
          );
        } else {
          alterMenu.build($target);
        }
      }
    }
  });

}
