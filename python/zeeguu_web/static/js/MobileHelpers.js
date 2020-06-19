function searchIconFunction() {
    var options = document.getElementById("optionsID");
    var optionsstyle = options.style.display;
    var sortings = document.getElementById("sortingBox")
    var sortingsstyle = sortings.style.display;
    if (optionsstyle == 'inline-flex' && sortingsstyle == 'flex') {
        options.style.display = 'none';
        sortings.style.display = 'none';
    } else {
        options.style.display = 'inline-flex';
        sortings.style.display = 'flex';
    }
}

function sideBarLoad() {
    var wi = window.outerWidth;
    var nav = document.getElementById("myTopnav");
    if (wi < 600) {
        nav.style.display = 'none';
        document.getElementById("arrow-p").className = 'arrow-none-block';
        document.getElementById('main-containerID').style.cssText = 'margin:0px;';
    }
}

function resizeShowOptions() {
    var w = window.outerWidth;
    var options = document.getElementById("optionsID");
    var nav = document.getElementById("myTopnav");
    var sortings = document.getElementById("sortingBox")
    if (w >= 600) {
        options.style.display = 'inline-flex';
        sortings.style.display = 'flex';
    } else {
        nav.style.display = 'none';
        document.getElementById("arrow-p").className = 'arrow-none-block';
        document.getElementById('main-containerID').style.cssText = 'margin:0px;';
    }
}

function hideToolbar() {
    var w = window.outerWidth;
    var toolbar = document.getElementById("toolbarContainer");
    var arrow = document.getElementById("arrow-p");

    if (w <= 600) {
        toolbar.style.display = 'none';
        arrow.style.display = 'none';
    }
}