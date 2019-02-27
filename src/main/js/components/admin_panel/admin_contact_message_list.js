import React, {Component} from 'react';
import AdminContactMessageListItem from './admin_contact_message_list_item';

const AdminContactMessageList = (props) => {

    const contactMessagesItems = props.contactmessages.map((contactmessage) => {
        return (
            <AdminContactMessageListItem
                key={contactmessage.id}
                contactmessage={contactmessage}
            />
        );
    });

    return (
        <table className="table table-striped">
            <thead>
            <tr>
                <th>ID</th>
                <th>Created Date</th>
                <th>Email</th>
                <th>Message</th>
            </tr>
            </thead>
            <tbody>
            {contactMessagesItems}
            </tbody>
        </table>
    )
};


export default AdminContactMessageList;
