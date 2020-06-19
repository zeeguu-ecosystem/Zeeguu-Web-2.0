/**
 * This fuction hides and displays settings options when clicking on settings wheel.
 */

function settingsFunction() {
    var box = document.getElementById("hidden");
    var boxstyle = box.style.display;
    
    if (boxstyle == "flex") {
        box.style.display = "none";
    } else {
        box.style.display = "flex";
    }
}