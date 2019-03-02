import React, {Component} from 'react';
import moment from 'moment';
//import {withRouter} from 'react-router-dom';
// import "../../../../../target/classes/static/main.css";
import "../../../resources/static/main.css";

import CopyToClipboard from 'react-copy-to-clipboard';
import AlertContainer from 'react-alert'
import axiosLib from '../../api/axiosLib';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getEvent } from '../../actions';


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
    }

    componentDidMount() {
        const id = this.props.match.params.id;
        this.props.getEvent(id);
    }


    showAlert () {
        this.msg.show('Link copied!', {
            time: 2000,
            type: 'success'
        })
    }


    render() {

        if (this.props.singleevent == null) {
            return ( <div>Loading...</div>);
        }

        let sameDay = moment(this.props.singleevent.startDate).isSame(moment(this.props.singleevent.finishDate), 'day');
        let startDate;
        let finishDate;

        if (sameDay) {
            startDate= moment(this.props.singleevent.startDate).format('MMMM Do YYYY h:mm a');
            finishDate = moment(this.props.singleevent.finishDate).format("h:mm a");
        } else {
            startDate= moment(this.props.singleevent.startDate).format('MMMM Do YYYY h:mm a');
            finishDate = moment(this.props.singleevent.finishDate).format('MMMM Do YYYY h:mm a');
        }

        const title = 'Local Events: '  + this.props.singleevent.title;

        const pathname = this.props.location.pathname;
        //TODO tbc if port is needed. Revisit this later.
        let x = document.domain;
        const shareUrl = 'http://' + x + pathname;

        return (



        <div className="nomarginsmall col-xs-12 col-sm-offset-1 col-sm-10  col-md-offset-2 col-md-8 col-lg-offset-2 col-lg-8">

                <div className="panel panel-primary">
                    <div className="panel-heading">
                        <h4>{this.props.singleevent.title}</h4>
                    </div>
                    <div className="panel-body just-line-break">

                        <div className="container-fluid">
                            <div className="row">
                                <img src={this.props.singleevent.posterURL} className="img-responsive center-block"/>
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
                                <td>{this.props.singleevent.address}</td>
                            </tr>
                            {this.props.singleevent.eventWebsite != null && this.props.singleevent.eventWebsite != "" &&
                            <tr>
                                <td><b>Website</b></td>
                                <td><a
                                    href={this.props.singleevent.eventWebsite}>{this.props.singleevent.eventWebsite}</a>
                                </td>
                            </tr>
                            }
                            {this.props.singleevent.contactPhone != null && this.props.singleevent.contactPhone != "" &&
                            <tr>
                                <td><b>Phone</b></td>
                                <td>{this.props.singleevent.contactPhone}</td>
                            </tr>
                            }
                            {this.props.singleevent.contactEmail != null && this.props.singleevent.contactEmail != "" &&
                            <tr>
                                <td><b>Email</b></td>
                                <td>{this.props.singleevent.contactEmail}</td>
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

                        {this.props.singleevent.description}
                    </div>
                </div>
            </div>
        );
    }
}


//  Copy redux state to component props
const mapStateToProps = (state) => {
    return {
        singleevent: state.events.singleEvent,
    };

};

export default connect(mapStateToProps,
    {getEvent})(EventShow);
// export default EventShow;