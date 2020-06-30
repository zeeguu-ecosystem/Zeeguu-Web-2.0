/** Validator class takes care of the input for generator
 *  It requests for bookmarks from Zeeguu API bookmarks-to-study endpoint
 *  Based on the result, it decides how to generate exercises
 *  If number of bookmarks == 0 then no bookmarks page
 *  If number of bookmarks < requested number then generate exercises that fit
 *  If number of bookmarks >= requested number simply generate exercises
 *  Init with @param {array} set: [[2,3],[1,3],[3,3],[4,3],[1,3]]
 *
 *  IMPORTANT: the function @getValidBookMarks assumes the set is created
 *  considering the minimum requirements for each exercise
 **/

import $ from 'jquery';
import Settings from "./settings";
import Session from "./session";
import Util from "./util";
import EmptyPage from "./pages/empty_page";
import LoadingAnimation from './animations/loading_animation';
import Ex1 from './exercises/ex1';
import Ex2 from './exercises/ex2';
import Ex3 from './exercises/ex3';
import Ex4 from './exercises/ex4';

class Validator{
    constructor(set){
        /** Class parameters*/
        this.set = set;
        this.validFinalSet = [];
        this.loadingAnimation = new LoadingAnimation();
        this.data = 0;
        this.session = Session.getSession();
        this.totalValidSize = 0;
        //Cache the imports for later reference
        this.cacheExerciseImports();
    }

    /**
     * The function caches imports in local scope for later to be referenced as a string
     * */
    cacheExerciseImports(){
        this.Ex1 = Ex1;
        this.Ex2 = Ex2;
        this.Ex3 = Ex3;
        this.Ex4 = Ex4;
    }

    /**
    *	Ajax get request to the Zeeguu API to get new bookmarks
    **/
    getBookmarks(totalSize){
        let _this = this;
        var address = Settings.ZEEGUU_API + Settings.ZEEGUU_STUDY_BOOKMARKS + totalSize + "?session=" + _this.session;
        return $.ajax({
            beforeSend: function(){
                _this.loadingAnimation.loadingAnimation(true);
            },
            type: 'GET',
            dataType: 'json',
            url: address,
            data: this.data,
            async: true,
        });
    }
    /**
     *  @param args is matrix of exercise name and number of bookmarks,
     *         example: [[1,3],[2,4]] 3 bookmarks for ex1 and 4 bookmarks for ex2
     *  @return matrix of exercises similar to its input
     * */
    getValidBookMarks(callback){
        let _this = this;
        //Calculate the size
        let totalSize = Util.calcSize(this.set,this.set.length);
        //TODO change the follwoing line to proper return value
        this.totalValidSize = totalSize;
        $.when(this.getBookmarks(totalSize)).done(function (data) {
            _this.validFinalSet = _this.validateSet(totalSize,data);
            callback(data);
        });
    }

    /**
     *  Given the set and the bookmarks create a new set for generator
     *  Three possibilities:
     *  number of bookmarks == 0 then show no bookmarks page
     *  number of bookmarks < requested number then generate exercises that fit
     *  number of bookmarks >= requested number simply generate exercises
     *  @return {Array} set, the validated ex set
     * */
    validateSet(totalSetLength,data){
        this.data = data;
        let bookmarkLength = this.data.length;

        if(bookmarkLength <= 0)
            return this.noBookmarkPage();
        if(bookmarkLength < totalSetLength)
            return this.notEnoughBookmarks(bookmarkLength,this.set);
        return this.enoughBookmarks(this.set);
    }

    /**
     * number of bookmarks >= requested number simply generate exercises
     * Assumes the given set has valid minimal sizes for exercises
     */
    enoughBookmarks(set){
        return set;
    }

    /**
     * Number of bookmarks < requested number, generate exercises that fit
     * @return {Array} set
     * TODO add testing
    */
    notEnoughBookmarks(bookmarkLength,set){
        let newSet = [];
        let setIndex = 0;
        while(bookmarkLength>0 && setIndex < set.length){
            let delta = bookmarkLength - set[setIndex][1];
            if(delta >=0){
                newSet.push(set[setIndex]);
                bookmarkLength = delta;
            }else if(this.isProperEx(set[setIndex][0],bookmarkLength)){//delta < 0 && the ex requirement is met
                newSet.push([set[setIndex][0],bookmarkLength]);
                bookmarkLength = delta;
            }
            setIndex++;
        }
        return (newSet.length>0)?newSet:this.noBookmarkPage();//Bookmarks is still 0, throw noBookmarks page
    }

    /**
     * Number of bookmarks == 0 then show no bookmarks page
     * Signals the generator to terminate, load no bookmark page
     * @return {Array} empty array
     * */
    noBookmarkPage(){
        let redirect = null;
        let newField;
        //If within the extension
        if (redirect!=null) {
            newField = {btnSecond:redirect,btnSecondText: 'Skip'};
        }else{
            newField = null;
        }
        let emptPg = new EmptyPage(newField);
        return [];
    }

    /**
     * Compares the minimum requirement for the given ex and the assigned amount
     * @param {int} exNum, the id of the ex
     * @param {int} exSize, the amount the ex is generated
     * @return {boolean}, true if the minReq >= givenAmount, else false
     * @example this.isProperEx(1,2), Ex1 2 times
     * */
    isProperEx(exNum,exSize){
        let minReqForEx = (this['Ex'+exNum]).prototype.minRequirement;
        return minReqForEx <= exSize;
    }

    /**
     * Getter for final valid size of the generated bookmarks
     * */
    get validSize(){
        return Util.calcSize(this.validFinalSet,this.validFinalSet.length);
    }

    /**
     * Getter for final valid set for exercise generator
     * */
    get validSet(){
        return this.validFinalSet;
    }
}

export default Validator;