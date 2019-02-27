import React, {Component} from 'react';
import { Link } from 'react-router-dom';

// import "../../../../../target/classes/static/event_list_item.css";
import "../../../resources/static/event_list_item.css";

import moment from 'moment';


class AdminContactMessageListItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const createdDateTimeMoment = moment(this.props.contactmessage.createdDate);
        const createdDateTime = createdDateTimeMoment.format('YYYY-MM-DD HH:mm');
        return (
            <tr>
                <td>
                    {this.props.contactmessage.id}
                </td>
                <td>
                    {createdDateTime}
                </td>
                <td>
                    {this.props.contactmessage.emailAddress}
                </td>
                <td>
                    {this.props.contactmessage.message}
                </td>
            </tr>

        );
    }

}

export default AdminContactMessageListItem;