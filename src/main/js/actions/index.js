import axiosLib from '../api/axiosLib';
// NOTE: babel issue. https://github.com/babel/babel/issues/5085
import 'babel-polyfill';
import { GET_EVENTS,
    GET_EVENT,
    SET_START_DATE,
    SET_END_DATE,
    SET_LAT_AND_LNG,
    SET_EVENTS_SEARCH_PARAMS,
    SET_ACTIVE_PAGE,
    SET_RADIUS,
    SET_LOC_PLACEHOLDER
} from "./types";


export const getEvents = () => async (dispatch, getState) => {

    let urlPath = '/api/events?page=' + getState().events.pageForREST
        + "&size=" + getState().events.pageSize
        + "&lat=" + getState().events.lat
        + "&lng=" + getState().events.lng
        + "&radius=" + getState().events.radius
        + "&start=" + getState().events.startDate
        + "&end=" + getState().events.endDate;

    try {
        const response = await axiosLib.get(urlPath);
        console.log('fetching events', response);
        dispatch({type: GET_EVENTS, payload: response});
    } catch (err) {
        console.log('fetching error', err);
        dispatch({type: GET_EVENTS, payload: mockEvents});


    }
};


export const setStartDate = (startDate) => {
    return {
        type: SET_START_DATE,
        payload: startDate
    }
};

export const setEndDate = (endDate) => {
    return {
        type: SET_END_DATE,
        payload: endDate
    }
};

export const setLatAndLng = (latLng) => {
    return {
        type: SET_LAT_AND_LNG,
        payload: latLng
    }
};


export const setActivePage = (activePage) => {
    return {
        type: SET_ACTIVE_PAGE,
        payload: activePage
    }
};

export const setRadius = (radius) => {
    return {
        type: SET_RADIUS,
        payload: radius
    }
};

export const setLocPlaceholder = (loc) => {
    return {
        type: SET_LOC_PLACEHOLDER,
        payload: loc
    }
};



export const setEventsSearchParams = (params) => {
    return {
        type: SET_EVENTS_SEARCH_PARAMS,
        payload: params
    }
};



export const getEvent = (id) => async dispatch => {


    try {
        const response = await axiosLib.get('/api/events/' + id);
        dispatch({type: GET_EVENT, payload: response});
    } catch (err) {
        console.log('SERVER ERROR', err);

        let mockObject = {

            data: {
                "id": "test-1",
                "title": "Waltham Forest: The Mayor’s London Borough of Culture 2019",
                "description": "The Mayor’s London Borough of Culture celebrates Waltham Forest’s cultural heritage, diversity, talent and places, during a 12-month programme of events. ",
                "startDate": 1551272400000,
                "finishDate": 1551279600000,
                "createdDate": null,
                "posterURL": "https://www.cityoflondon.gov.uk/things-to-do/green-spaces/epping-forest/visitor-information/wheretogoineppingforest/PublishingImages/walthamstow-forest-lg.jpg",
                "address": "London Gatwick",
                "approved": false,
                "emailAddress": "admin.web@gmail.com",
                "additionalInformation": null,
                "cost": null,
                "eventWebsite": null,
                "contactPhone": null,
                "contactEmail": null,
                "location": [
                    51.1536621,
                    -0.1820629
                ],
                "g-recaptcha-response": null
            }
        };

        dispatch({type: GET_EVENT, payload: mockObject});
    }




};

let mockEvents = {

    data : {

        content:  [
            {
                "id": "test-1",
                "title":"Waltham Forest: The Mayor’s London Borough of Culture 2019",
                "description":"The Mayor’s London Borough of Culture celebrates Waltham Forest’s cultural heritage, diversity, talent and places, during a 12-month programme of events. ",
                "startDate":1551272400000,
                "finishDate":1551279600000,
                "createdDate":null,
                "posterURL":"https://www.cityoflondon.gov.uk/things-to-do/green-spaces/epping-forest/visitor-information/wheretogoineppingforest/PublishingImages/walthamstow-forest-lg.jpg",
                "address":"London Gatwick",
                "approved":false,
                "emailAddress":"admin.web@gmail.com",
                "additionalInformation":null,
                "cost":null,
                "eventWebsite":null,
                "contactPhone":null,
                "contactEmail":null,
                "location":[
                    51.1536621,
                    -0.1820629
                ],
                "g-recaptcha-response":null
            },
            {
                "id": "test-2",
                "title":"Pancake Day in London",
                "description":"Feast on a mountain of pancakes on Shrove Tuesday and watch runners flip their pans in one of London's charity pancake racesE",
                "startDate":1551445200000,
                "finishDate":1551452400000,
                "createdDate":null,
                "posterURL":"https://cdn.londonandpartners.com/asset/pancake-day-in-london_celebrate-with-decadent-pancakes-image-courtesy-of-the-breakfast-club_6adaa5eb85f5a8f5356d2f672fb4d12f.jpg",
                "address":"Birmingham",
                "approved":false,
                "emailAddress":"admin.web@gmail.com",
                "additionalInformation":null,
                "cost":null,
                "eventWebsite":null,
                "contactPhone":null,
                "contactEmail":null,
                "location":[
                    51.1536621,
                    -0.1820629
                ],
                "g-recaptcha-response":null
            },
            {
                "id": "test-3",
                "title":"St Patrick's Day in London",
                "description":"See the spectacular parade, catch free performances in Trafalgar Square, and enjoy Irish food and Guinness, as you celebrate St Paddy's Day in London",
                "startDate":1551531600000,
                "finishDate":1551538800000,
                "createdDate":null,
                "posterURL":"https://cdn.londonandpartners.com/asset/st-patricks-day_st-patricks-day-in-london-image-courtesy-of-greater-london-authority_13c2735d6f9813fefa4a3615a07dde04.jpg",
                "address":"Trafalgar Square",
                "approved":false,
                "emailAddress":"admin.web@gmail.com",
                "additionalInformation":null,
                "cost":null,
                "eventWebsite":null,
                "contactPhone":null,
                "contactEmail":null,
                "location":[
                    51.507786,
                    -0.127789
                ],
                "g-recaptcha-response":null
            }
        ],

        totalElements: 3,
        totalPages: 1




    }




}