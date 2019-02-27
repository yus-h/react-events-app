import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class AdminPanel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div className="container">
                <ul>
                    <li>
                        <Link to="/adminpanel/events/new/true">
                            Add Event
                        </Link>
                    </li>
                    <li>
                        <Link to="/adminpanel/jsonevent">
                            Add JSON Event
                        </Link>
                    </li>
                    <li>
                        <Link to="/adminpanel/events">
                            Events
                        </Link>
                    </li>

                    <li>
                        <Link to="/adminpanel/contactmessages">
                            Contact Messages
                        </Link>
                    </li>

                    <li>
                        <Link to="/adminpanel/changepassword">
                            Change Password
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default AdminPanel;
