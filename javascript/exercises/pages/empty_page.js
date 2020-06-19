/**
 * Created by Martin on 5/14/2017.
 */
import $ from "jquery";
import { Loader } from "../loader";
import Mustache from "mustache";

var EmptyPage = function (newFields = null) {
  this.init(newFields);
};

EmptyPage.prototype = {
  /************************** SETTINGS ********************************/
  emptyTemplateURL: "static/template/empty_page.html",
  templateFields: {
    //icon: "static/img/icons/empty_page_icon.svg",
    title: "Sorry, you don't have enough words to practice yet.",
    info: "Start by reading an article and click on words to translate.",
    // btnPrime: "https://www.zeeguu.org/read", //SHOULD WE SAY .dev ??
    //btnPrimeText: "Let's Read",
    //btnSecond: false,
    //btnSecondText: "Skip",
  },
  emptyTemplate: 0,

  /*********************** General Functions ***************************/
  /**
   *	Saves the dom
   **/
  cacheDom: function () {},

  /**
   * Merges two javascript objects together
   * @param {Object} oldField, the field that will be overwritten
   * @param {Object} newField, the field that provides which properties to override
   * @return {Object} merged field
   * TODO test this
   * */
  mergeField: function (oldField, newField) {
    for (let key in newField) {
      if (newField.hasOwnProperty(key)) {
        oldField[key] = newField[key];
      }
    }
    return oldField;
  },

  /**
   *	Exercise initialaizer
   **/
  init: function (newField) {
    if (newField != null) {
      this.templateFields = this.mergeField(this.templateFields, newField);
    }
    this.start();
  },

  /**
   *	The main constructor
   **/
  start: function () {
    var _this = this;
    $.when(
      Loader.loadTemplateIntoElem(_this.emptyTemplateURL, $("#main-content"))
    ).done(function (data) {
      // Create the DOM and start the generator
      _this.emptyTemplate = data;
      _this.cacheDom();
      _this.genPage();
      _this.bindUIActions();
    });
  },

  genPage: function () {
    let html = Mustache.to_html(this.emptyTemplate, this.templateFields);
    $("#main-content").html(html);
  },

  bindUIActions: function () {},

  terminate: function () {
    //If any events terminate here
  },
};

export default EmptyPage;
