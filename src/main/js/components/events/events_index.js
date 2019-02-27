import React, {Component} from 'react';
import EventList from './event_list';
import { Link } from 'react-router-dom';

import PlaceSearch from './place_search';
import RadiusSearch from './radius_search';
import Pagination  from 'react-js-pagination';
import DateFilter from './date_filter';
// import "../../../../../target/classes/static/event_list_item.css";
import "../../../resources/static/event_list_item.css";
import moment from 'moment';

const client = require('../../client');
const pageSize = 15;
const queryString = require('query-string');
import axiosLib from '../../api/axiosLib';

class EventsIndex extends Component {

    constructor(props) {
        super(props);

        //Default Yesterday

        let startDateMoment = moment().hour(1).minute(0).subtract(1, 'days');
        let startDate = startDateMoment.format('DD-MM-YYYY');
        //Default today + 2 months
        let endDateMoment = moment().hour(1).minute(0).add(2, 'months');
        let endDate = endDateMoment.format('DD-MM-YYYY');

        this.state = {
            events: [],
            lat: 52.947150,
            lng: -1.147053,
            radius: 700,
            pageForREST: 0,
            pageSize: pageSize,
            activePage: 1, //note will be pageForREST +1.
            totalItemsCount: 0,
            pageRangeDisplayed: 1,
            searchComplete: false,
            radiusTest: 700, //TODO potenitially refactor in the future
            //TODO limit radius on server side?
            searchPlaceholder: "Search a location...",
            startDate: startDate,
            endDate: endDate
        };
    }

    /**
     * Called on the initial render of the component.
     */
    componentDidMount() {

        const parsed = queryString.parse(this.props.location.search);

        if (parsed != null && parsed.page != null) {
           this.parseQueryString(parsed);
        } else {
            this.eventsSearch(this.state.lat, this.state.lng); //Default
        }
    }

    /**
     * Called each time the URL changes.
     */
    componentWillReceiveProps(nextProps) {
        window.scrollTo(0, 0);

        const parsed = queryString.parse(nextProps.location.search);
        this.parseQueryString(parsed);
    }


    /**
     * Given a query string. Make the appropriate URL call.
     * @param parsed
     */
    parseQueryString(parsed) {
        let pageNumberToQuery = 0;
        let activePage = 1;
        let radius = 700; //default radius
        let lat = 52.947150;
        let lng = -1.147053;
        let loc = "Search a location...";

        //Default Yesterday
        let startDateMoment = moment().hour(1).minute(0).subtract(1, 'days');
        let startDate = startDateMoment.format('DD-MM-YYYY');
        //Default today + 2 months
        let endDateMoment = moment().hour(1).minute(0).add(2, 'months');
        let endDate = endDateMoment.format('DD-MM-YYYY');

        if (parsed  != null && parsed.page != null) {

            if(parsed.page != null) {
                pageNumberToQuery = Number(parsed.page) - 1;
                activePage = pageNumberToQuery + Number(1);
            }

            //Page should be reset to 1 if radius is modified
            if (parsed.r != null) {
                radius = Number(parsed.r);
            }

            if(parsed.lat != null & parsed.lng != null) {
                lat = parsed.lat;
                lng = parsed.lng;
            }

            if (parsed.loc != null) {
                loc = parsed.loc;
            }

            if (parsed.start != null) {
                startDate = parsed.start;
            }

            if (parsed.end != null) {
                endDate = parsed.end;
            }

        }


        this.setState(
            {   pageForREST: pageNumberToQuery,
                activePage: activePage,
                radius: radius,
                lat: lat,
                lng: lng,
                searchComplete: false,
                radiusTest: radius,
                searchPlaceholder: loc,
                startDate: startDate,
                endDate: endDate


            },
            function () {
                this.eventsSearch(this.state.lat, this.state.lng);
            }
        );
    }

    /**
     * Page should reset to 1
     * lat and lng should be added to query
     * radius should be maintained
     */
    newLocationSearch(lat, lng, address) {

        const currentSearchParams = this.props.location.search;
        let newSearchParams = "";
        if (currentSearchParams == "") {
            newSearchParams = "lat=" + lat + "&lng=" + lng + "&loc=" + address ;
        } else {
            let parsed = queryString.parse(currentSearchParams);
            parsed.page = 1,
            parsed.lat = lat,
            parsed.lng = lng
            parsed.loc = address
            newSearchParams = $.param(parsed);
        }


        this.props.history.push({
            pathname: '/',
            search: newSearchParams
        })
    }

    eventsSearch(lat, lng, address) {
        this.setState({
            lat: lat,
            lng: lng
        }, function () {
            this.performGetRequest();
        });

    }

    /**
     * NOTE: Setting the radius will reset the page to 1.
     * lat and lng should be preserved though.
     */
    radiusSearch(radius) {

        const currentSearchParams = this.props.location.search;
        let newSearchParams = "";
        if (currentSearchParams == "") {
            newSearchParams = "r=" + radius;
        } else {
            let parsed = queryString.parse(currentSearchParams);
            parsed.page = 1;
            parsed.r = radius;
            newSearchParams = $.param(parsed);
        }


        this.props.history.push({
            pathname: '/',
            search: newSearchParams
        })
    }

    startDateChanged(startDate) {

        const startDateMoment = moment(startDate);
        const startDateFormatted = startDateMoment.format('DD-MM-YYYY');

        const currentSearchParams = this.props.location.search;
        let newSearchParams = "";
        if (currentSearchParams == "") {
            newSearchParams = "start=" + startDateFormatted;
        } else {
            let parsed = queryString.parse(currentSearchParams);
            parsed.start = startDateFormatted;
            parsed.page = 1;
            newSearchParams = $.param(parsed);
        }


        this.props.history.push({
            pathname: '/',
            search: newSearchParams
        })
    }

    endDateChanged(endDate) {
        const endDateMoment = moment(endDate);
        const endDateFormatted = endDateMoment.format('DD-MM-YYYY');

        const currentSearchParams = this.props.location.search;
        let newSearchParams = "";
        if (currentSearchParams == "") {
            newSearchParams = "end=" + endDateFormatted;
        } else {
            let parsed = queryString.parse(currentSearchParams);
            parsed.end = endDateFormatted;
            parsed.page = 1;
            newSearchParams = $.param(parsed);
        }


        this.props.history.push({
            pathname: '/',
            search: newSearchParams
        })
    }



    performGetRequest() {

        let urlPath = '/api/events?page=' + this.state.pageForREST
        + "&size=" + this.state.pageSize
        + "&lat=" + this.state.lat
        + "&lng=" + this.state.lng
        + "&radius=" + this.state.radius
        + "&start=" + this.state.startDate
        + "&end=" + this.state.endDate;

        axiosLib.get(urlPath)
            .then(response => {
                console.log('DATA REPONSE#!#!#!#', response);
                this.setState({
                    events: response.entity.content,
                    totalItemsCount: response.entity.totalElements,
                    pageRangeDisplayed: response.entity.totalPages,
                    searchComplete: true
                });

                if (this.state.pageForREST == 0) {
                    this.setState({
                        activePage: 1,
                        searchComplete: true
                    });
                }
            }).catch(err => {

                console.log('ERROR GETTING RESULTS', err);


            let eventsResponse = [
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
                    "location":null,
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
                    "location":null,
                    "g-recaptcha-response":null
                }
            ];

            this.setState({
                events: eventsResponse,
                totalItemsCount: 3,
                pageRangeDisplayed: 1,
                searchComplete: true
            });

        });
    }


    /**
     * This just modifies the URL
     * Once the URL is modified componentWillReceiveProps is called
     * This will then parse the Query to set the state
     * Which in turn calls the corresponding GET request.
     *
     * NOTE: Changing the page should retain the radius in the URL.
     * @param pageNumber
     */
    handlePageChange(pageNumber) {

        const currentSearchParams = this.props.location.search;
        let newSearchParams = "";
        if (currentSearchParams == "") {
            newSearchParams = "page=" + pageNumber;
        } else {

            let parsed = queryString.parse(currentSearchParams);
            parsed.page = pageNumber;
            newSearchParams = $.param(parsed);
        }

        this.props.history.push({
            pathname: '/',
            search: newSearchParams
        })
    }




    //TODO can we set preset location text in PlaceSearch?
    render() {

        const searchType = ['(cities)'];
        return (
            <div>

                {/*//https://stackoverflow.com/questions/26708205/webpack-watch-isnt-compiling-changed-files*/}
                {/* TODO why npm run watch not work for intellij*/}
                <div className="page-header text-center">
                    <h2>Local Events&nbsp;
                        <small>Discover events in the UK near you!!</small>

                    </h2>
                </div>


                {this.props.children}



                <div className="row">
                    <div className="col-sm-12 text-center">
                        <PlaceSearch
                            onSearchLocationChange={(lat, lng, address) => this.newLocationSearch(lat, lng, address)}
                            searchType={searchType} searchPlaceholder={this.state.searchPlaceholder}
                        />
                    </div>
                </div>

                <br/>

                <div className="form-group row">
                    <div
                        className="col-xs-12 col-sm-4 col-sm-offset-4 col-md-2 col-md-offset-5 col-lg-2 col-lg-offset-5 text-center">
                        <RadiusSearch radiusTest={this.state.radiusTest} onRadiusChange={(radius) => this.radiusSearch(radius)}/>
                    </div>
                </div>

                <div className="row">
                    <div className="text-center">
                        <DateFilter selectedStart={this.state.startDate} selectedEnd={this.state.endDate} onStartDateChanged = {(startDate) => this.startDateChanged(startDate)}  onEndDateChanged = {(endDate) => this.endDateChanged(endDate)}/>
                    </div>
                </div>

                <br/>

                <div className="row">
                    <div className="col-sm-12">
                        <EventList events={this.state.events}/>

                        {this.state.totalItemsCount ==0 && this.state.searchComplete == true &&
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3 col-lg-6 col-lg-offset-3 text-center">
                                <h2>No Events Found</h2>
                            </div>
                        </div>
                        }

                        {this.state.totalItemsCount ==0 && this.state.searchComplete == false &&
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3 col-lg-6 col-lg-offset-3 text-center">
                                <h2>Searching...</h2>
                            </div>
                        </div>
                        }
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12  text-center">
                        <Pagination
                            activePage={this.state.activePage}
                            itemsCountPerPage={this.state.pageSize}
                            totalItemsCount={this.state.totalItemsCount}
                            pageRangeDisplayed={this.state.pageRangeDisplayed}
                            onChange={this.handlePageChange.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default EventsIndex;
