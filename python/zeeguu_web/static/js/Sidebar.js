/**
 * This fuction hides and displays the sidebar whenever the arrow is clicked.
 * Each check represents a single pages and ensures that the contents remain centered whenever the sidebar moves.
 * For further refactoring we should ensure that all pages are styled in a smiliar manner.
 */

function sideBarFunction(element) {
    var nav = document.getElementById("myTopnav");
    var navstyle = nav.style.display;
    if (navstyle == "none") {
        nav.style.display = "block";
        element.className = "arrow-icon";
        check1();
        check2();
        check3();
        check4();
        check5();
        check6();
        check7();
        check8();
    } else {
        nav.style.display = "none";
        element.className = "arrow-none-block";
        check9();
        check10();
        check11();
        check12();
        check13();
        check14();
        check15();
        check16();
    }
}

function check1() {
    if (document.getElementById("main-containerID") !== null) {
        document.getElementById("main-containerID").style.cssText = "margin-left:12.5em;";
    }
}

function check2() {
    if (document.getElementById("settingsContainer") !== null) {
        document.getElementById("settingsContainer").style.cssText = "margin-left:12.5em;";
    }
}

function check3() {
    if (document.getElementById("statsContainerID") !== null) {
        document.getElementById("statsContainerID").style.cssText = "margin-left:14em;";
        document.getElementById("containerStats").style.cssText = "margin-left:0em;";
    }
}

function check4() {
    if (document.getElementById("starter-body") !== null) {
        document.getElementById("starter-body").style.cssText =
            "padding-left:11em;";
        document.getElementById("footnotes").style.cssText =
            "padding-left:5em;";
    }
}

function check5() {
    if (document.getElementById("ex-module") !== null) {
        document.getElementById("ex-module").style.cssText = "margin-left:12.5em;";
    }
}

function check6() {
    if (document.getElementById("aboutContainer") !== null) {
        document.getElementById("aboutContainer").style.cssText = "margin-left:10em;";
    }
}

function check7() {
    if (document.getElementById("emptyPage") !== null) {
        document.getElementById("emptyPage").style.cssText = "margin-left:5em;";
    }
}

function check8() {
    if (document.getElementById("wordsContainer") !== null) {
        document.getElementById("wordsContainer").style.cssText = "margin-left:7.5em;";
    }
}

function check9() {
    if (document.getElementById("main-containerID") !== null) {
        document.getElementById("main-containerID").style.cssText = "margin-left:0px;";
    }
}

function check10() {
    if (document.getElementById("settingsContainer") !== null) {
        document.getElementById("settingsContainer").style.cssText = "margin:auto;";
    }
}

function check11() {
    if (document.getElementById("statsContainerID") !== null) {
        document.getElementById("statsContainerID").style.cssText = "margin-left:0em;";
        document.getElementById("containerStats").style.cssText = "margin-left:-9em;";
    }
}

function check12() {
    if (document.getElementById("starter-body") !== null) {
        document.getElementById("starter-body").style.cssText = "padding-left:0em;";
        document.getElementById("footnotes").style.cssText = "padding-left:0em;";
    }
}

function check13() {
    if (document.getElementById("ex-module") !== null) {
        document.getElementById("ex-module").style.cssText = "margin-left:0px;";
    }
}

function check14() {
    if (document.getElementById("aboutContainer") !== null) {
        document.getElementById("aboutContainer").style.cssText = "margin-left:1em;";
    }
}

function check15() {
    if (document.getElementById("emptyPage") !== null) {
        document.getElementById("emptyPage").style.cssText = "margin-left:0em;";
    }
}

function check16() {
    if (document.getElementById("wordsContainer") !== null) {
        document.getElementById("wordsContainer").style.cssText = "margin-left:0em;";
    }
}