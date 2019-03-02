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
import {
    setEndDate,
    setStartDate,
    setEventsSearchParams,
    setLatAndLng,
    getEvents,
    setLocPlaceholder,
    setRadius,
    setActivePage
} from "../../actions/index";

const client = require('../../client');
const queryString = require('query-string');
import { connect } from 'react-redux';

class EventsIndex extends Component {

    constructor(props) {
        super(props);
    }

    /**
     * Called on the initial render of the component.
     */
    componentDidMount() {

        //Default Yesterday

        let startDateMoment = moment().hour(1).minute(0).subtract(1, 'days');
        let startDate = startDateMoment.format('DD-MM-YYYY');
        //Default today + 2 months
        let endDateMoment = moment().hour(1).minute(0).add(2, 'months');
        let endDate = endDateMoment.format('DD-MM-YYYY');

        this.props.setStartDate(startDate);
        this.props.setEndDate(endDate);


        const parsed = queryString.parse(this.props.location.search);

        if (parsed != null && parsed.page != null) {
           this.parseQueryString(parsed);
        } else {
            this.props.getEvents();
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
        //Default Yesterday
        let startDateMoment = moment().hour(1).minute(0).subtract(1, 'days');
        let startDate = startDateMoment.format('DD-MM-YYYY');
        //Default today + 2 months
        let endDateMoment = moment().hour(1).minute(0).add(2, 'months');
        let endDate = endDateMoment.format('DD-MM-YYYY');

        if (parsed  != null) {

            let queryParamChanged = false;

            if(parsed.page != null) {
                let pageNumberToQuery = Number(parsed.page) - 1;
                let activePage = pageNumberToQuery + Number(1);
                this.props.setActivePage(activePage);
            } else {
                let pageNumberToQuery = 0;
                let activePage = pageNumberToQuery + Number(1);
                this.props.setActivePage(activePage);

            }

            //Page should be reset to 1 if radius is modified
            if (parsed.r != null && parsed.r != this.props.radius) {
                let radius = Number(parsed.r);
                this.props.setRadius(radius);
                queryParamChanged = true;

            }

            if(parsed.lat != null && parsed.lng != null
            && parsed.lat != this.props.lat && parsed.lng != this.props.lng) {
                let lat = parsed.lat;
                let lng = parsed.lng;
                this.props.setLatAndLng({lat: lat, lng:lng})
                queryParamChanged = true;
            }

            if (parsed.loc != null && parsed.loc != this.props.searchPlaceholder) {
                let loc = parsed.loc;
                this.props.setLocPlaceholder(loc);
                queryParamChanged = true;
            }

            if (parsed.start != null && parsed.start != this.props.startDate) {
                startDate = parsed.start;
                this.props.setStartDate(startDate)
                queryParamChanged = true;
            }

            if (parsed.end != null && parsed.start != this.props.endDate) {
                endDate = parsed.end;
                this.props.setEndDate(endDate);
                queryParamChanged = true;
            }

            // Perform a new search with updated query params
            if (queryParamChanged === true) {
                this.props.getEvents();
            }

        }



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
            parsed.lng = lng,
            parsed.loc = address,
            newSearchParams = $.param(parsed);
        }


        this.props.history.push({
            pathname: '/',
            search: newSearchParams
        })
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
                            searchType={searchType} searchPlaceholder={this.props.searchPlaceholder}
                        />
                    </div>
                </div>

                <br/>

                <div className="form-group row">
                    <div
                        className="col-xs-12 col-sm-4 col-sm-offset-4 col-md-2 col-md-offset-5 col-lg-2 col-lg-offset-5 text-center">
                        <RadiusSearch radiusTest={this.props.radius} onRadiusChange={(radius) => this.radiusSearch(radius)}/>
                    </div>
                </div>

                <div className="row">
                    <div className="text-center">
                        <DateFilter selectedStart={this.props.startDate} selectedEnd={this.props.endDate} onStartDateChanged = {(startDate) => this.startDateChanged(startDate)}  onEndDateChanged = {(endDate) => this.endDateChanged(endDate)}/>
                    </div>
                </div>


                <br/>

                <div className="row">
                    <div className="col-sm-12">
                        <EventList events={this.props.events}/>

                        {this.props.totalItemsCount ==0 && this.props.searchComplete == true &&
                        <div className="row">
                            <div className="col-xs-12 col-sm-6 col-sm-offset-3 col-md-6 col-md-offset-3 col-lg-6 col-lg-offset-3 text-center">
                                <h2>No Events Found</h2>
                            </div>
                        </div>
                        }

                        {this.props.totalItemsCount ==0 && this.props.searchComplete == false &&
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
                            activePage={this.props.activePage}
                            itemsCountPerPage={this.props.pageSize}
                            totalItemsCount={this.props.totalItemsCount}
                            pageRangeDisplayed={this.props.pageRangeDisplayed}
                            onChange={this.handlePageChange.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}



//  Copy redux state to component props
const mapStateToProps = (state) => {
    return {
        events: state.events.events,
        lat: state.events.lat,
        lng: state.events.lng,
        radius: state.events.radius,
        pageForREST: state.events.pageForREST,
        pageSize: state.events.pageSize,
        activePage: state.events.activePage,
        totalItemsCount: state.events.totalItemsCount,
        pageRangeDisplayed: state.events.pageRangeDisplayed,
        searchComplete: state.events.searchComplete,
        radiusTest: state.events.radiusTest,
        searchPlaceholder: state.events.searchPlaceholder,
        startDate: state.events.startDate,
        endDate: state.events.endDate,
    };

};

export default connect(mapStateToProps,
    {
        setStartDate,
        setEndDate,
        setLatAndLng,
        setEventsSearchParams,
        getEvents,
        setActivePage,
        setRadius,
        setLocPlaceholder
    }
    )(EventsIndex);