//Get React from installed node_modules
import React, {Component} from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

//import {Router, browserHistory} from 'react-router' ;
const client = require('../client');
import EventsIndex from '../components/events/events_index';
import EventShow from '../components/events/event_show';
import EventNew from '../components/forms/event_new';
import LoginForm from '../components/forms/login_form'
import AdminPanel from '../components/admin_panel/admin_panel'
import AdminJsonEvent from '../components/admin_panel/admin_json_event'
import ContactForm from '../components/forms/contact_form'
import AdminPanelEvents from '../components/admin_panel/admin_panel_events'
import AdminPanelContactMessages from '../components/admin_panel/admin_panel_contact_messages'
import ChangePassword from '../components/forms/change_password';
import ForgotPassword from './forms/forgot_password';
import ResetPassword from './forms/reset_password';

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            navExpanded: false
        };

        this.setNavExpanded = this.setNavExpanded.bind(this);
        this.closeNav = this.closeNav.bind(this);
    }

    setNavExpanded(expanded) {
        this.setState({ navExpanded: expanded });
    }

    closeNav() {
        this.setState({ navExpanded: false });
    }


    render() {
        return (

            <BrowserRouter>

            <div>
                <nav className="navbar navbar-inverse navbar-fixed-top">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>

                        </div>
                        <div className="collapse navbar-collapse" id="myNavbar">
                            <ul className="nav navbar-nav">
                                <li data-toggle="collapse" data-target=".in">
                                    <Link to="/">
                                        Home
                                    </Link>
                                </li>
                                <li data-toggle="collapse" data-target=".in">
                                    <Link to="/submitevent">
                                        Submit Event
                                    </Link>
                                </li>
                                <li data-toggle="collapse" data-target=".in">
                                    <Link to="/contactus">
                                        Contact Us
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>


                <Switch>
                    <Route exact path="/login" component={LoginForm} />
                    <Route exact path="/submitevent" component={EventNew} />
                    <Route exact path="/contactus" component={ContactForm} />
                    <Route exact path="/event/:id" component={EventShow}/>
                    <Route exact path="/forgotpassword" component={ForgotPassword}/>
                    <Route exact path="/resetpassword" component={ResetPassword}/>


                    <Route exact path="/adminpanel" component={AdminPanel}/>
                    <Route exact path="/adminpanel/events" component={AdminPanelEvents}/>
                    <Route exact path="/adminpanel/jsonevent" component={AdminJsonEvent}/>
                    <Route exact path="/adminpanel/events/:id" component={EventNew}/>
                    <Route exact path="/adminpanel/events/new/:isnew" component={EventNew}/>
                    <Route exact path="/adminpanel/contactmessages" component={AdminPanelContactMessages}/>
                    <Route exact path="/adminpanel/changepassword" component={ChangePassword}/>


                    <Route exact path='/' component={EventsIndex}/>


                </Switch>
            </div>

            </BrowserRouter>
        );
    }
}
export default App;
