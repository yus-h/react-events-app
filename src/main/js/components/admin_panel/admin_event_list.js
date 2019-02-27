import React, {Component} from 'react';
import AdminEventListItem from './admin_event_list_item';


const AdminEventList = (props) => {

    const eventItems = props.events.map((event) => {
        return (
            <AdminEventListItem
                key={event.id}
                event={event}
                editEvent={props.editEvent}/>
        );
    });

    return (
        <table className="table table-striped">
            <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Created Date</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Poster URL</th>
                <th>Address</th>
                <th>Location</th>
                <th>Contact Info</th>
                <th>Email</th>
                <th>Additional Info</th>
                <th>Approved</th>
                <th>Edit</th>
            </tr>
            </thead>
            <tbody>
            {eventItems}
            </tbody>
        </table>
    )
};


export default AdminEventList;
