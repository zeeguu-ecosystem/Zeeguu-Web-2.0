/**
 * Class for reading the text
 * */

var BCP47_ID = {
    'nl': 'nl-NL',
    'da': 'da-DK',
    'it': 'it-IT',
    'ro': 'ro-RO',
    'fr': 'fr-FR',
    'de': 'de-DE',
    'el': 'el-GR',
    'es': 'es-ES',
    'no': 'no-NO',
    'pt': 'pt-PT',
    'pl': 'pl-PL'
};

function voice(lang) {
    console.log(lang);
    let synth = window.speechSynthesis;
    let voices_for_language = synth.getVoices().filter(voice => voice.lang == BCP47_ID[lang]);
    console.log(voices_for_language);
    return voices_for_language[0];

}


export default class Speaker {

    /**
     * @param {String} txt - the text to be spoken.
     * @param {String} lang - speak the text in language. @example 'nl'
     */


    static speak(txt, lang) {

        console.log("in speak");
        let message = new SpeechSynthesisUtterance();
        message.text = txt;
        message.voice = voice(lang);

        speechSynthesis.speak(message);
    }
};