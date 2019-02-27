import React, {Component} from 'react';
import AdminContactMessageList from './admin_contact_message_list';
import Pagination  from 'react-js-pagination';

const client = require('../../client');

class AdminPanelContactMessages extends Component {

    constructor(props) {
        super(props);

        this.state = {
            contactmessages: [],
            pageForREST: 0,
            pageSize: 3,
            activePage: 1, //note will be pageForREST +1.
            totalItemsCount: 0,
            pageRangeDisplayed: 1,
        };
    }

    componentDidMount() {
        this.performGetRequest();
    }

    performGetRequest() {
        client({
            method: 'GET',
            path: '/api/contactmessages?page=' + this.state.pageForREST
            + "&size=" + this.state.pageSize
        })
            .done(response => {
                this.setState({
                    contactmessages: response.entity.content,
                    totalItemsCount: response.entity.totalElements,
                    pageRangeDisplayed: response.entity.totalPages
                });
            });

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
                        <AdminContactMessageList
                            contactmessages={this.state.contactmessages}
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

export default AdminPanelContactMessages;
