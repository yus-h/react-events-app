import React, {Component} from 'react';
import { Link } from 'react-router-dom';
// import "../../../../../target/classes/static/event_list_item.css";
import "../../../resources/static/event_list_item.css";

import moment from 'moment';
import TextTruncate from 'react-text-truncate';

class AdminEventListItem extends Component {

    constructor(props) {
        super(props);
        this.editEvent = this.editEvent.bind(this);
    }


    editEvent() {
        this.props.editEvent(this.props.event);
    }

    render() {
        const startDateTimeMoment = moment(this.props.event.startDate);
        const startDateTime = startDateTimeMoment.format('YYYY-MM-DD HH:mm');

        const createdDateTimeMoment = moment(this.props.event.createdDate);
        const createdDateTime = createdDateTimeMoment.format('YYYY-MM-DD HH:mm');

        const finishDateTimeMoment = moment(this.props.event.finishDate);
        const finishDateTime = finishDateTimeMoment.format('YYYY-MM-DD HH:mm');

        return (
            <tr>
                <td>
                    <Link to={"/event/" + this.props.event.id} style={{textDecoration: 'none'}}>
                        View
                    </Link>
                </td>
                <td>
                    {this.props.event.title}
                </td>
                <td>
                    <TextTruncate
                        line={2}
                        truncateText="…"
                        text={this.props.event.description}
                        textTruncateChild={""}
                    />}
                </td>
                <td>
                    {createdDateTime}
                </td>
                <td>
                    {startDateTime}
                </td>
                <td>
                    {finishDateTime}
                </td>
                <td>
                    <a href={this.props.event.posterURL}>View</a>
                </td>
                <td>
                    {this.props.event.address}
                </td>
                <td>
                    {this.props.event.location}
                </td>
                <td>
                    <b>Website:</b>{this.props.event.eventWebsite}<br/>
                    <b>Email:</b>{this.props.event.contactEmail}<br/>
                    <b>Phone:</b>{this.props.event.contactPhone}<br/>
                </td>
                <td>
                    {this.props.event.emailAddress}
                </td>
                <td>
                    {this.props.event.additionalInformation}
                </td>
                <td>
                    {this.props.event.approved + ''}
                </td>
                <td>
                    <Link to={"/adminpanel/events/" + this.props.event.id} style={{textDecoration: 'none'}}>
                        Edit
                    </Link>
                </td>

            </tr>

        );
    }

}

export default AdminEventListItem;