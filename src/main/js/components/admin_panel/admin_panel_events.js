import React, {Component} from 'react';
import AdminEventList from './admin_event_list';
import Pagination  from 'react-js-pagination';

const client = require('../../client');

class AdminPanelEvents extends Component {

    constructor(props) {
        super(props);


        this.state = {
            events: [],
            selectedEvent: null,
            pageForREST: 0,
            pageSize: 30,
            activePage: 1, //note will be pageForREST +1.
            totalItemsCount: 0,
            pageRangeDisplayed: 1,
        };


        this.handleChange = this.handleChange.bind(this);
        this.editEvent = this.editEvent.bind(this);

    }

    componentDidMount() {
        this.performGetRequest();
    }

    performGetRequest() {
        client({
            method: 'GET',
            path: '/api/events/all?page=' + this.state.pageForREST
            + "&size=" + this.state.pageSize
        })
            .done(response => {
                this.setState({
                    events: response.entity.content,
                    totalItemsCount: response.entity.totalElements,
                    pageRangeDisplayed: response.entity.totalPages
                });
            });

    }


    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    editEvent(event) {
        //Callback currently not used
    }

    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
        const pageNumberToQuery = pageNumber - 1;

        //TODO: if this is slow - may just pass in parameters to eventSearch
        this.setState(
            {pageForREST: pageNumberToQuery},
            function () {
                this.performGetRequest();
            }
        );


    }


    render() {
        return (
            <div className="container">

                <div className="row">
                    <div>
                        <AdminEventList
                            events={this.state.events}
                            editEvent={this.editEvent}
                        />
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

export default AdminPanelEvents;
