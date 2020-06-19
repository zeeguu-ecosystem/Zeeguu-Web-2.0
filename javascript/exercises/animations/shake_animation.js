/**
 * This class is responsible for animating elements that have a class attribute "shakable".
 * When an element is clicked with class "shakable", class "shake" is added to its attributes.
 * After the animation is done the "shake" class is removed.
 * In HTML use the class "shakable" for each element that shake property
 * @Example <div class="shakable"></div>
 * */

import $ from 'jquery';

export default class ShakeAnimation{

    constructor(){
        this.animationEvent = 'webkitAnimationEnd oanimationend msAnimationEnd animationend';
        this.bindUIActions();
    }

    /**
     * Make all the actions connected to this module
     * return {void}
     * */
    bindUIActions(){
        var _this = this;
        $('.shakable').click((event) => {this.shakeEvent($(event.target));});
    }

    /**
     * Use the clicked element to invoke shakeElement
     * @return {void}
     * */
    shakeEvent(elem){
        this.shakeElement(elem);
    }

    /**
     * Function adds class shake, after the animation is done,
     * the class shake is removed from the element
     * @param {jQuery element}, elem
     * @return {void}
     * */
    shakeElement(elem){
        elem.addClass('shake wrongAlert');
        elem.one(this.animationEvent, function(event) {
            elem.removeClass('shake wrongAlert')
        });
    }

    /**
     * Shakes the element that has the focus
     * @return {void}
     * */
    shakeFocusedElement(){
        this.shakeElement($(document.activeElement));
    }

    /**
     * Make the given element shakable
     * @param {Object}, element
     * @return {void}
    * */
    makeShakable(elem){
        elem.addClass('shakable');
        this.bindUIActions();
    }

    /**
     * Make the given element non shakable
     * @param {Object}, element
     * @return {void}
     * */
    makeNonShakable(elem){
        elem.removeClass('shakable');
        this.bindUIActions();
    }
}
