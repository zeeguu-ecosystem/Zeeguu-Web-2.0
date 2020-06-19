//noinspection JSAnnotator
/**
 * File containing global settings for exercises
 * */

export default {
    /*********************** Exercise API Parameters **************************/

    ZEEGUU_API: 'https://api.zeeguu.org',
    ZEEGUU_SESSION_ID: 'sessionID',
    ZEEGUU_DEFAULT_COOKIE_EXPIRATION: 21, //days
    ZEEGUU_DEFAULT_SESSION: '00055320',//  00055320-french 00026435 00926044 34563456 11010001

    /******************** Exercise Bookmark Parameters ************************/
    ZEEGUU_STUDY_BOOKMARKS: '/bookmarks_to_study/',
    ZEEGUU_DELETE_BOOKMARKS: '/delete_bookmark',
    ZEEGUU_LEARNING_LANGUAGE: '/learned_language',

    /*********************** Exercise Outcome Parameters **************************/

    /** Current endpoint for submitting the result*/
    ZEEGUU_EX_OUTCOME_ENDPOINT: '/report_exercise_outcome',

    /** Source types for exercise outcome */
    ZEEGUU_EX_SOURCE_RECOGNIZE: '/Recognize_L1W_in_L2T',
    ZEEGUU_EX_SOURCE_SELECT: '/Select_L2W_fitting_L2T',
    ZEEGUU_EX_SOURCE_MATCH: '/Match_three_L1W_to_three_L2W',
    ZEEGUU_EX_SOURCE_TRANSLATE: '/L1W_to_L1W_with_L2T_Example',

    /** Outcome types for exercise */
    ZEEGUU_EX_OUTCOME_CORRECT: '/Correct',
	ZEEGUU_EX_OUTCOME_WRONG: '/Wrong',
	ZEEGUU_EX_OUTCOME_HINT: '/Asked_for_hint',

};