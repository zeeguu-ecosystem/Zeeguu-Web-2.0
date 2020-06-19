/**
 * Animation class is for general animations within the application
 * The GeneralAnimation class is a singleton class,
 * meaning that there is at most 1 instance of the class available
 * */
import $ from 'jquery';

let animationInstance = null;

class LoadingAnimation {
    constructor(){
        if(animationInstance){
            return animationInstance;
        }
        /** Class parameters*/
        this.$loader = null;
        this.$content = null;
        this.updateCache();
    }
    /**
     * Update/save the cache of the dom
     * */
    updateCache(){
        this.$loader = $('#loader');
        this.$content = $('#main-content');
    }

    loadingAnimation(activate) {
        //If cache is not available
        if(this.$loader == null || this.$content == null){
            this.updateCache();
        }
        //Turn on the animation
        if (activate === true) {
            this.$content.addClass('hide');
            this.$loader.removeClass('hide');
        } else {//Turn off the animation unhide the content
            this.$content.removeClass('hide');
            this.$loader.addClass('hide');
        }
    }
}

export default LoadingAnimation;