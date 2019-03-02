import axiosLib from '../api/axiosLib';
// NOTE: babel issue. https://github.com/babel/babel/issues/5085
import 'babel-polyfill';
import { GET_EVENTS, GET_EVENT } from "./types";


// export const getEvents = () => async dispatch => {
//     const response = await streams.get('/streams');
//     dispatch({type: FETCH_STREAMS, payload: response.data});
// };

// TODO current babel does not work with async
// export const getEvent = (id) => async dispatch => {
// export const getEvent = (id) => {
//
//   console.log('GET EVENT', id);
//     axiosLib.get('/api/events/' + id)
//         .then(response => {
//             console.log('DATA REPONSE FLUX ####', response);
//             dispatch({type: GET_EVENT, payload: response});
//         })
//         .catch(err => {
//             console.log('ERR', err);
//             return {'a': 'b'};
//         });
//
//
// };


// export const getEvent = (id) => {

export const getEvent = (id) => async dispatch => {



    try {
        const response = await axiosLib.get('/api/events/' + id);
        console.log('fetching stream', response);
        dispatch({type: GET_EVENT, payload: response});
    } catch (err) {
        console.log('SERVER ERROR', err);

        let mockObject =   {
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
        };

        dispatch({type: GET_EVENT, payload: mockObject});

        console.log('DISPATCH', mockObject);
    }




};

