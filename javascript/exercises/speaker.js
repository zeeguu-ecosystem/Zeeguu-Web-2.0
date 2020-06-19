/**
 * Class for reading the text
 * */
export default class Speaker {

    /**
     * @param {String} txt - the text to be spoken.
     * @param {String} lang - speak the text in language. @example 'nl'
     */
    static speak(txt, lang) {
        let spkr = new SpeechSynthesisUtterance();
        spkr.text = txt;
        spkr.lang = lang;
        speechSynthesis.speak(spkr);
    }
};