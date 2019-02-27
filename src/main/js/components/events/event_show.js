import React, {Component} from 'react';
import moment from 'moment';
//import {withRouter} from 'react-router-dom';
// import "../../../../../target/classes/static/main.css";
import "../../../resources/static/main.css";

import CopyToClipboard from 'react-copy-to-clipboard';
import AlertContainer from 'react-alert'
import axiosLib from '../../api/axiosLib';

import {
    ShareButtons,
    generateShareIcon
} from 'react-share';


const {
    FacebookShareButton,
    GooglePlusShareButton,
    TelegramShareButton,
    WhatsappShareButton,
    EmailShareButton,
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const GooglePlusIcon = generateShareIcon('google');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');
const EmailIcon = generateShareIcon('email');

const client = require('../../client');


const alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
}

/**
 *
 *
 */
class EventShow extends Component {

    constructor(props) {
        super(props);

        this.state = {
            singleevent2: null
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.performGetRequest(id);
    }


    performGetRequest(id) {
        console.log('GET REQUEST ID: ', id);

        axiosLib.get('/api/events/' + id)
            .then(response => {
            console.log('DATA REPONSE####', response);
            this.setState({singleevent: response.entity});
            })
            .catch(err => {
                console.log('ERR2', err);
                // TODO temp mocking data
                this.setState({singleevent:  {
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
                }});

            });


    };



    showAlert () {
        this.msg.show('Link copied!', {
            time: 2000,
            type: 'success'
        })
    }


    render() {

        if (this.state.singleevent == null) {
            return ( <div>Loading...</div>);
        }

        let sameDay = moment(this.state.singleevent.startDate).isSame(moment(this.state.singleevent.finishDate), 'day');
        let startDate;
        let finishDate;

        if (sameDay) {
            startDate= moment(this.state.singleevent.startDate).format('MMMM Do YYYY h:mm a');
            finishDate = moment(this.state.singleevent.finishDate).format("h:mm a");
        } else {
            startDate= moment(this.state.singleevent.startDate).format('MMMM Do YYYY h:mm a');
            finishDate = moment(this.state.singleevent.finishDate).format('MMMM Do YYYY h:mm a');
        }

        const title = 'Local Events: '  + this.state.singleevent.title;

        const pathname = this.props.location.pathname;
        //TODO tbc if port is needed. Revisit this later.
        let x = document.domain;
        const shareUrl = 'http://' + x + pathname;

        return (



        <div className="nomarginsmall col-xs-12 col-sm-offset-1 col-sm-10  col-md-offset-2 col-md-8 col-lg-offset-2 col-lg-8">

                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h4>{this.state.singleevent.title}</h4>
                    </div>
                    <div className="panel-body just-line-break">

                        <div className="container-fluid">
                            <div className="row">
                                <img src={this.state.singleevent.posterURL} className="img-responsive center-block"/>
                            </div>
                        </div>

                        <br/>

                        <table className="table table-striped">
                            <tbody>
                            <tr>
                                <td className="col-xs-4 col-sm-3 col-md-2"><b>When</b></td>
                                <td className="col-xs-8 col-sm-9 col-md-10">{!sameDay &&  <span className="badge badge-info">MULTIDAY</span> }
                                    {startDate} to {finishDate}</td>
                            </tr>
                            <tr>
                                <td><b>Where</b></td>
                                <td>{this.state.singleevent.address}</td>
                            </tr>
                            {this.state.singleevent.eventWebsite != null && this.state.singleevent.eventWebsite != "" &&
                            <tr>
                                <td><b>Website</b></td>
                                <td><a
                                    href={this.state.singleevent.eventWebsite}>{this.state.singleevent.eventWebsite}</a>
                                </td>
                            </tr>
                            }
                            {this.state.singleevent.contactPhone != null && this.state.singleevent.contactPhone != "" &&
                            <tr>
                                <td><b>Phone</b></td>
                                <td>{this.state.singleevent.contactPhone}</td>
                            </tr>
                            }
                            {this.state.singleevent.contactEmail != null && this.state.singleevent.contactEmail != "" &&
                            <tr>
                                <td><b>Email</b></td>
                                <td>{this.state.singleevent.contactEmail}</td>
                            </tr>
                            }
                            <tr>
                                <td><CopyToClipboard text={shareUrl}
                                                     onCopy={this.showAlert.bind(this)}>
                                    <button type="button" className="btn btn-primary copyurlbutton">COPY URL</button>

                                </CopyToClipboard></td>
                                <td>{shareUrl}
                                </td>
                            </tr>
                            </tbody>
                        </table>


                        <div>
                            <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
                        </div>

                        <table className="table table-borderless">
                            <tbody>

                            <tr>
                                <td>
                                    <FacebookShareButton
                                        url={shareUrl}
                                        quote={title}>
                                        <FacebookIcon
                                            size={32}
                                            round />
                                    </FacebookShareButton>
                                </td>
                                <td>
                                    <GooglePlusShareButton
                                        url={shareUrl}
                                    >
                                        <GooglePlusIcon
                                            size={32}
                                            round />
                                    </GooglePlusShareButton>
                                </td>

                                <td>
                                <TelegramShareButton
                                    url={shareUrl}
                                    title={title}
                                >
                                    <TelegramIcon
                                        size={32}
                                        round />
                                </TelegramShareButton>
                                </td>

                                <td>
                                <WhatsappShareButton
                                    url={shareUrl}
                                    title={title}
                                    separator=":: "
                                >
                                    <WhatsappIcon
                                        size={32}
                                        round />
                                </WhatsappShareButton>
                                </td>

                                <td>
                                <EmailShareButton
                                    url={shareUrl}
                                    subject={title}
                                    body={shareUrl}
                                >
                                    <EmailIcon
                                        size={32}
                                        round />
                                </EmailShareButton>
                                </td>
                            </tr>
                            </tbody>

                        </table>

                        {this.state.singleevent.description}
                    </div>
                </div>
            </div>
        );
    }
}


export default EventShow;