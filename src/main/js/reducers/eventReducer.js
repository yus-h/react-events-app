import {GET_EVENT, GET_EVENTS} from "../actions/types";

const INITIAL_STATE = {
    singleEvent: null,
};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_EVENT:
            return {
                ...state,
                singleEvent: action.payload
                // userId: action.payload
            };
        // case GET_EVENTS:
        //     return {
        //         ...state,
        //         // isSignedIn: false,
        //         // userId: null
        //     };
        default:
            return state;
    }

};