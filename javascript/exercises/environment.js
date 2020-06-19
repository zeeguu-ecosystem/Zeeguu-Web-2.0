/**
 * Created by Martin on 5/12/2017.
 */
class Environment{
    static backButtonPreAction(){
        window.onbeforeunload = function() {
            return "Your work will be lost.";
        };
    }
}

export default Environment;