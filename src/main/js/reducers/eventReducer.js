import {
    GET_EVENT,
    GET_EVENTS,
    SET_START_DATE,
    SET_END_DATE,
    SET_LAT_AND_LNG,
    SET_EVENTS_SEARCH_PARAMS,
    SET_ACTIVE_PAGE,
    SET_RADIUS,
    SET_LOC_PLACEHOLDER
} from "../actions/types";

const INITIAL_STATE = {
    singleEvent: null,


    // main events page
    events: [],
    lat: 52.947150,
    lng: -1.147053,
    radius: 700,
    pageForREST: 0,
    pageSize: 25,
    activePage: 1, //note will be pageForREST +1.
    totalItemsCount: 0,
    pageRangeDisplayed: 1,
    searchComplete: false,
    radiusTest: 700, //TODO potenitially refactor in the future
    //TODO limit radius on server side?
    searchPlaceholder: "Search a location...",
    startDate: null,
    endDate: null

};


export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_EVENT:
            return {
                ...state,
                singleEvent: action.payload.data
            };
        case GET_EVENTS:
            let activePage = state.activePage;
            if (state.pageForREST == 0) {
                activePage =  1;
            }

            return {
                ...state,
                events: action.payload.data.content,
                totalItemsCount: action.payload.data.totalElements,
                pageRangeDisplayed: action.payload.data.totalPages,
                searchComplete: true,
                activePage: activePage
            };

        case SET_START_DATE:
            return {
                ...state,
                startDate: action.payload
            };
        case SET_END_DATE:
            return {
                ...state,
                endDate: action.payload
            };
        case SET_LAT_AND_LNG:
            return {
                ...state,
                lat: action.payload.lat,
                lng: action.payload.lng,
            };

        case SET_ACTIVE_PAGE:
            return {
                ...state,
                activePage: action.payload
            };
        case SET_RADIUS:
            return {
                ...state,
                radius: action.payload
            };

        case SET_LOC_PLACEHOLDER:
            return {
                ...state,
                searchPlaceholder: action.payload
            };
        case SET_EVENTS_SEARCH_PARAMS:
            return {
                ...state,
                pageForREST: action.payload.pageForREST,
                activePage: action.payload.activePage,
                radius: action.payload.radius,
                lat: action.payload.lat,
                lng: action.payload.lng,
                searchComplete: action.payload.searchComplete,
                radiusTest: action.payload.radiusTest,
                searchPlaceholder: action.payload.searchPlaceholder,
                startDate: action.payload.startDate,
                endDate: action.payload.endDate,

            }
        default:
            return state;
    }

};