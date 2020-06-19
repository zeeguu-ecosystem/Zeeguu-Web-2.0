/**
 * Created by Martin on 5/4/2017.
 */

export default class cookieHandler {
    /**
     * Retrive cookie given the
     * @param {String} name, cookie name
     * */
    static getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return '';
    }

    /**
     * Set cookie given the
     * @param {String} name, cookie identifier
     * @param {Object} value, value of the cookie
     * @param {int} days, expiration time
     * */
    static setCookie (name, value, days) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        }
        else {
            expires = '';
        }
        document.cookie = name + "=" + value + expires + "; path=/";
    }
}