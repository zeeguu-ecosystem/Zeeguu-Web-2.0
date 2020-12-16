import $ from "jquery";
import Mustache from "mustache";
import ArticleList from "./ArticleList";
import BookmarkedArticleList from "./BookmarkedArticleList";
import SourceSubscriptionList from "./SourceSubscriptionList.js";
import CohortArticleList from "./CohortArticleList";
import config from "../config";
import InterestSubscriber from "./InterestSubscriber.js";
import InterestSubscriptionList from "./InterestSubscriptionList.js";
import CustomInterestSubscriptionList from "./CustomInterestSubscriptionList";

import NonInterestSubscriber from "./NonInterestSubscriber.js";
import NonInterestSubscriptionList from "./NonInterestSubscriptionList.js";
import CustomNonInterestSubscriptionList from "./CustomNonInterestSubscriptionList";


const HTML_ID_SEARCH_NOTIFCATION_TEMPLATE = "#search-notification-template";
const HTML_ID_SEARCH_NOTIFICATION = ".searchNotification";


/* Script that binds listeners to html events, such that the
 * correct object is called to handle it. */
let sourceSubscriptionList = new SourceSubscriptionList();
let articleList = new ArticleList(sourceSubscriptionList);
let starredArticleList = new BookmarkedArticleList();
let cohortArticleList = new CohortArticleList();
let customInterestSubscriptionList = new CustomInterestSubscriptionList();
let interestSubscriptionList = new InterestSubscriptionList();
let interestSubscriber = new InterestSubscriber(
  interestSubscriptionList,
  customInterestSubscriptionList
);

let nonInterestSubscriptionList = new NonInterestSubscriptionList();
let customNonInterestSubscriptionList = new CustomNonInterestSubscriptionList();
let nonInterestSubscriber = new NonInterestSubscriber(
  nonInterestSubscriptionList,
  customNonInterestSubscriptionList
);


document.addEventListener(config.EVENT_SUBSCRIPTION, function () {


    console.log(window.location.href);

    if (window.location.href.endsWith("/bookmarks")) {
        console.log("BOOKMARKS!");
        starredArticleList.load();


    } else if (window.location.href.endsWith("/classroom")) {
        console.log("CLASSROOM!");
        cohortArticleList.load();

    } else {
        console.log("READ!!!!");
        articleList.clear();
        articleList.load();
        $(HTML_ID_SEARCH_NOTIFICATION).empty();
    }

});

document.addEventListener(config.EVENT_LOADING, function () {
    articleList.clear();
    //articleList.showLoader();
});

var interacting_with_the_main_article_list;

export function take_keyboard_focus_away_from_article_list() {
    console.log("focus taken away");
    interacting_with_the_main_article_list = false;
}

export function set_keyboard_focus_to_article_list() {
    console.log("focus retrieved");
    interacting_with_the_main_article_list = true;
}

export function article_list_has_focus() {
    return interacting_with_the_main_article_list;
}

function prepare_tab_interaction(tab_name) {
    //this is designed for the cohort, inbox, and starred tabs on the home of the reader

    $("#" + tab_name + "_tab").click(function (e) {
        localStorage.setItem("activeTab", tab_name);
    });
}

function activate_last_used_tab_if_available() {
    var activeTab = localStorage.getItem("activeTab");
    if (activeTab) {
        $("a.headmenuTab").removeClass("is-active");
        $("#" + activeTab + "_tab").addClass("is-active");
        $(".articleTab").removeClass("is-active");
        $("#" + activeTab).addClass("is-active");
    } else {
        $("#inbox_tab").addClass("is-active");
        $("#inbox").addClass("is-active");
    }
}

/* When the document has finished loading,
 * bind all necessary listeners. */
$(document).ready(function () {

  interestSubscriptionList.load();
  interestSubscriber.load();
  customInterestSubscriptionList.load();
  nonInterestSubscriptionList.load();
  nonInterestSubscriber.load();
  customNonInterestSubscriptionList.load();



    prepare_tab_interaction("cohort");
    prepare_tab_interaction("inbox");
    prepare_tab_interaction("starred");
    activate_last_used_tab_if_available();

    let showAddTopicDialogButton = document.querySelector(
        ".show-topic-subscriber"
    );


    $(showAddTopicDialogButton).click(function () {
        interestSubscriber.open();
    });

  let showAddFilterDialogButton = document.querySelector(
    ".show-filter-subscriber"
  );
  
  $(showAddFilterDialogButton).click(function () {
    nonInterestSubscriber.open();
  });



    // reload articles
    document.dispatchEvent(new CustomEvent(config.EVENT_SUBSCRIPTION));

    // keyboard navigation
    set_keyboard_focus_to_article_list();

    let searchExecuted = document.querySelector("#search-expandable");
    $(searchExecuted).keyup(function (event) {
        if (event.keyCode === 13) {
            let input = $(searchExecuted).val();
            $(searchExecuted).val("");
            articleList.search(input);
            showSearchNotification(input);
            $("#emptyArticleListImage").hide();
        }
    });


    var countWords = 0;
    $(".wordsSorting").click(function () {
        if (countLevel == 1 || countLevel == 2) {
            $("#triangleLevel").removeClass("clicked");
            if ($("#triangleLevel").hasClass("flip")) {
                $("#triangleLevel").removeClass("flip");
            }
            countLevel = 0;
        }
        countWords++;
        if (countWords == 1) {
            handleOneClickWords();
        } else if (countWords == 2) {
            handleTwoClickWords();
        } else if (countWords == 3) {
            handleThreeClickWords();
            countWords = 0;
        }
    });

    var countLevel = 0;
    $(".levelSorting").click(function () {
        if (countWords == 1 || countWords == 2) {
            $("#triangleWords").removeClass("clicked");
            if ($("#triangleWords").hasClass("flip")) {
                $("#triangleWords").removeClass("flip");
            }
            countWords = 0;
        }
        countLevel++;
        if (countLevel == 1) {
            handleOneClickLevel();
        } else if (countLevel == 2) {
            handleTwoClickLevel();
        } else if (countLevel == 3) {
            handleThreeClickLevel();
            countLevel = 0;
        }
    });

    sourceSubscriptionList.load();

});

function handleOneClickLevel() {
    var elem = $("#articleLinkList").find("li").sort(sortLowToHighLevel);
    var bookmarkElem = $("#starredArticleList")
        .find("li")
        .sort(sortLowToHighLevel);
    var classroomElem = $("#cohortArticleList")
        .find("li")
        .sort(sortLowToHighLevel);
    appendLists(elem, bookmarkElem, classroomElem);
    $("#triangleLevel").addClass("flip");
    $("#triangleLevel").addClass("clicked");
}

function handleTwoClickLevel() {
    var elem = $("#articleLinkList").find("li").sort(sortHighToLowLevel);
    var bookmarkElem = $("#starredArticleList")
        .find("li")
        .sort(sortHighToLowLevel);
    var classroomElem = $("#cohortArticleList")
        .find("li")
        .sort(sortHighToLowLevel);
    appendLists(elem, bookmarkElem, classroomElem);
    $("#triangleLevel").removeClass("flip");
}

function handleThreeClickLevel() {
    location.reload();
    $("#triangleLevel").removeClass("clicked");
    $("#triangleLevel").removeClass("flip");
}

function handleOneClickWords() {
    var elem = $("#articleLinkList").find("li").sort(sortLowToHighWords);
    var bookmarkElem = $("#starredArticleList")
        .find("li")
        .sort(sortLowToHighWords);
    var classroomElem = $("#cohortArticleList")
        .find("li")
        .sort(sortLowToHighWords);
    appendLists(elem, bookmarkElem, classroomElem);
    $("#triangleWords").addClass("flip");
    $("#triangleWords").addClass("clicked");
}

function handleTwoClickWords() {
    var elem = $("#articleLinkList").find("li").sort(sortHighToLowWords);
    var bookmarkElem = $("#starredArticleList")
        .find("li")
        .sort(sortHighToLowWords);
    var classroomElem = $("#cohortArticleList")
        .find("li")
        .sort(sortHighToLowWords);
    appendLists(elem, bookmarkElem, classroomElem);
    $("#triangleWords").removeClass("flip");
}

function handleThreeClickWords() {
    location.reload();
    $("#triangleWords").removeClass("clicked");
}


function appendLists(elem, bookmarkElem, classroomElem) {
    $("#articleLinkList").append(elem);
    $("#starredArticleList").append(bookmarkElem);
    $("#cohortArticleList").append(classroomElem);
}

function sortLowToHighWords(a, b) {
    var aInt = getIntegerWords(a.className);
    var bInt = getIntegerWords(b.className);
    return aInt < bInt ? -1 : 1;
}

function sortLowToHighLevel(a, b) {
    var aInt = getIntegerLevel(a.className);
    var bInt = getIntegerLevel(b.className);
    return aInt < bInt ? -1 : 1;
}

function sortHighToLowWords(a, b) {
    var aInt = getIntegerWords(a.className);
    var bInt = getIntegerWords(b.className);
    return aInt > bInt ? -1 : 1;
}

function sortHighToLowLevel(a, b) {
    var aInt = getIntegerLevel(a.className);
    var bInt = getIntegerLevel(b.className);
    return aInt > bInt ? -1 : 1;
}

function getIntegerWords(classNameList) {
    var int = 0;
    var classList = classNameList.split(/\s+/);
    int = parseInt(classList[0]);
    return int;
}

function getIntegerLevel(classNameList) {
    var int = 0;
    var classList = classNameList.split(/\s+/);
    int = parseFloat(classList[1]);
    return int;
}

/* Called when no image could be loaded as an article avatar. */
function noAvatar(image) {
    image.src = noAvatarURL;
}

function showSearchNotification(input) {
    let template = $(HTML_ID_SEARCH_NOTIFCATION_TEMPLATE).html();
    $(HTML_ID_SEARCH_NOTIFICATION).empty();

    let templateAttributes = {
        displayText: "You searched for : " + input,
    };

    let element = Mustache.render(template, templateAttributes);
    $(HTML_ID_SEARCH_NOTIFICATION).append(element);

    let searchNotificationBox = document.querySelector(
        ".search-notification-box"
    );

    $(searchNotificationBox).click(function () {
        articleList.clear();
        articleList.load();
        $(HTML_ID_SEARCH_NOTIFICATION).empty();
    });
}

$(document).keydown(function (event) {
    if (article_list_has_focus()) {
        let highlighted_element = $("#articleLinkList").children(
            ".highlightedArticle"
        );

        switch (event.key) {
            case "ArrowDown":
                _select_next_article(highlighted_element, true);
                break;
            case "ArrowUp":
                _select_next_article(highlighted_element, false);
                break;
            case "Enter":
                window.location.href = highlighted_element.children("a")[0].href;
                break;
        }
    }
});

function scrollToView(elem) {
    var margin_of_error = 100;

    var offset = elem.offset().top;
    if (!elem.is(":visible")) {
        elem.css({visibility: "hidden"}).show();
        var offset = elem.offset().top;
        elem.css({visibility: "", display: ""});
    }

    var visible_area_start = $(window).scrollTop();
    var visible_area_end = visible_area_start + window.innerHeight;

    if (
        offset < visible_area_start + margin_of_error ||
        offset > visible_area_end - margin_of_error
    ) {
        // Not in view so scroll to it
        elem[0].scrollIntoView();
        return false;
    }
    return true;
}

function _select_next_article(highlighted_element, direction_forward) {
    if (highlighted_element[0] == undefined) {
        $("#articleLinkList").children(":first").toggleClass("highlightedArticle");
    } else {
        let new_higlight;

        if (direction_forward) {
            new_higlight = $("#articleLinkList")
                .children(".highlightedArticle")
                .next()
                .next();
        } else {
            new_higlight = $("#articleLinkList")
                .children(".highlightedArticle")
                .prev()
                .prev();
        }

        // we couldn't find a next or a previous...
        if (new_higlight[0] == undefined) {
            return;
        }

        new_higlight.toggleClass("highlightedArticle");
        highlighted_element.toggleClass("highlightedArticle");
        scrollToView(new_higlight);
    }
}

export function reload_articles_on_drawer_close() {
    $(".subscribeButton").click(function () {
        document.dispatchEvent(new CustomEvent(config.EVENT_SUBSCRIPTION));
        set_keyboard_focus_to_article_list();
    });
}
