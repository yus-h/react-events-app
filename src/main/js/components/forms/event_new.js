import React, {Component} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import PlaceSearch from '../events/place_search';
import ReCAPTCHA from 'react-google-recaptcha';
import AlertContainer from 'react-alert';

const client = require('../../client');
const format = 'h:mm a';

const defaultState = {
    title: "",
    description: "",
    startDate: moment().hour(13).minute(0),
    selectedStartTime: moment().hour(13).minute(0),
    finishDate: moment().hour(14).minute(0),
    selectedFinishTime: moment().hour(14).minute(0),
    posterURL: "",
    location: [],
    address: "",
    editMode: false,
    emailAddress: "",
    additionalInformation: "",
    approved: false,
    eventWebsite: "",
    contactPhone: "",
    contactEmail: ""
};

//const recaptchaKey = "6Ld1iS8UAAAAAI_z86HJJz7234JNbbANAM2UNJX4"; //dev
const recaptchaKey = "6Leoii8UAAAAAPeuTI0TNi1VdXmmsDUkwosG4iZ1"; //prod

const alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
};

class EventNew extends Component {

    constructor(props) {
        super(props);

        this.state = defaultState;

        this.handleChange = this.handleChange.bind(this);
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
        this.handleFinishDateChange = this.handleFinishDateChange.bind(this);
        this.handleFinishTimeChange = this.handleFinishTimeChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.onCaptchaChange = this.onCaptchaChange.bind(this);
    }

    /**
     * Reusable for edit event
     */
    componentDidMount() {

        window.scrollTo(0, 0);

        this.setState({
            'g-recaptcha-response': "",
            adminNewMode: false,
            editMode: false
        });

        //ID will have a value if we go to /adminpanel/events/59b1ae07cffaa943acf2b6f6
        const id = this.props.match.params.id;
        if (id != null) {
            this.setupEditMode(id);
        }

        //Bit of a hack for admin create mode
        const isAdminNewMode = this.props.match.params.isnew;
        if (isAdminNewMode == 'true') {
            this.setState({
                adminNewMode: true,
                'g-recaptcha-response': "IGNORE"
            });
        }
    }

    setupEditMode(id) {
        client({method: 'GET', path: '/api/events/' + id})
            .done(response => {

                this.setState({
                    title: response.entity.title,
                    description: response.entity.description,
                    startDate: moment(response.entity.startDate),
                    selectedStartTime: moment(response.entity.startDate),
                    finishDate: moment(response.entity.finishDate),
                    selectedFinishTime: moment(response.entity.finishDate),

                    posterURL: response.entity.posterURL,
                    eventWebsite: response.entity.eventWebsite,
                    contactPhone: response.entity.contactPhone,
                    contactEmail: response.entity.contactEmail,

                    location: response.entity.location,

                    address: response.entity.address,
                    emailAddress: response.entity.emailAddress,
                    additionalInformation: response.entity.additionalInformation,
                    editMode: true,
                    id: response.entity.id,
                    approved: response.entity.approved,
                    'g-recaptcha-response': "",
                    adminNewMode: false
                });
            });

    }


    showAlert (type, customMessage, time) {

        if (type == 'info') {
            this.msg.info(customMessage, {
                time: time,
                type: 'success'
            })
        } else if (type =='error') {
            this.msg.error(customMessage, {
                time: time,
                type: 'success'
            })
        } else {
            this.msg.success(customMessage, {
                time: time,
                type: 'success'
            })

        }

    }



    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleDropDown(event) {
        this.setState({approved: event.target.value});
    }


    handleStartDateChange(date) {
        const selectedTime = this.state.selectedStartTime.format('HH:mm');
        const chosenDate = date && date.format('MM/DD/YYYY');
        const startDateTime = moment(chosenDate + ' ' + selectedTime);
        this.setState({
            startDate: startDateTime
        });
    }

    handleFinishDateChange(date) {
        const selectedTime = this.state.selectedFinishTime.format('HH:mm');
        const chosenDate = date && date.format('MM/DD/YYYY');
        const finishDateTime = moment(chosenDate + ' ' + selectedTime);
        this.setState({
            finishDate: finishDateTime
        });
    }

    handleStartTimeChange(value) {
        const startDateFormatted = this.state.startDate.format('MM/DD/YYYY');
        const selectedTime = value.format('HH:mm');
        const startDateTime = moment(startDateFormatted + ' ' + selectedTime);
        this.setState({
            startDate: startDateTime,
            selectedStartTime: value
        });
    }

    handleFinishTimeChange(value) {
        const finishDateFormatted = this.state.finishDate.format('MM/DD/YYYY');
        const selectedTime = value.format('HH:mm');
        const finishDateTime = moment(finishDateFormatted + ' ' + selectedTime);

        this.setState({
            finishDate: finishDateTime,
            selectedFinishTime: value
        });
    }

    eventsSearch(lat, lng, address) {
        this.setState({
            location: [lat, lng],
            address: address
        })
    }

    onCaptchaChange(value) {
        this.setState({
            'g-recaptcha-response': value
        });
    }


    //Note: MongoDB saves time in DB which is fine.
    handleSubmit(e) {

        this.showAlert('info', "Submitting...", 1500);

        if (this.state.editMode == true) {
            this.submitEdit();
        } else {
            this.submitNewEvent();
        }
        e.preventDefault();
    }


    submitEdit() {

        client({
            method: 'PUT',
            path: '/api/events/' + this.state.id,
            entity: this.state,
            headers: {'Content-Type': 'application/json'}
        }).done(response => {
            if (response.status.code == 200) {
                this.showAlert('success', "Edit successful!", 2000);
            } else {
                this.showAlert('error', "Error! Please refresh the page and try again!", 3000);
            }
        });
    }

    submitNewEvent() {
        client({
            method: 'POST',
            path: '/api/events',
            entity: this.state,
            headers: {'Content-Type': 'application/json'}
        }).done(response => {
            if (response.status.code == 200) {
                this.setState(defaultState);
                //Leave g-recaptcha-response  state as what it was.
                //This means user will have to refresh page to submit another event - which is fine
                this.showAlert('success', "Success! Your request will be moderated, and if successful, will be published within the next 5 days.", 7000);
            } else {
                this.showAlert('error', "Error! Please refresh the page and try again!", 3000);
            }
        }, response => {
            if (response.status.code === 403) {
                this.showAlert('error', "Error! Invalid captcha!", 3000);
            }
        });
    }


    render() {

        const searchType = ['geocode'];


        return (


            <form className="form-horizontal" onSubmit={this.handleSubmit}>

                <fieldset>

                    <legend>{this.state.editMode == true ? 'Edit Event' : 'Submit Event'}</legend>


                    <div className="form-group">
                        <label className="col-md-4 control-label"></label>
                        <div className="col-md-6">
                            Know of an event taking place? Submit the details here and (pending approval)
                            it will be available on this website for everyone to see! <i>(Note: You don't have to be the event organiser to submit an event)</i>
                        </div>
                    </div>



                    <div className="form-group visible-xs visible-sm hidden-md hidden-lg">
                        <label className="col-md-4 control-label"></label>
                        <div className="col-md-6">
                            <b>NOTE:</b> This form is not optimised for mobile. It is strongly
                            advised to complete this form on a laptop/PC
                        </div>
                    </div>


                    <div className="form-group">
                        <label className="col-md-4 control-label"></label>
                        <div className="col-md-6">
                            <span className="text-danger">*</span><i> Indicates required field</i>
                        </div>
                    </div>


                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="title">Title <span
                            className="text-danger">*</span></label>
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                id="title"
                                name="title"
                                type="text"
                                value={this.state.title}
                                onChange={this.handleChange}
                                required/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="description">Description <span
                            className="text-danger">*</span></label>
                        <div className="col-md-6">
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={this.state.description}
                            onChange={this.handleChange}
                            rows="7"
                            required>
                        </textarea>

                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="startDate">Start Date <span
                            className="text-danger">*</span></label>
                        <div className="col-md-6">
                            <DatePicker
                                className="form-control"
                                id="startDate"
                                type="date"
                                name="startDate"
                                dateFormat="DD/MM/YYYY"
                                selected={this.state.startDate}
                                onChange={this.handleStartDateChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="startTime">Start Time <span
                            className="text-danger">*</span></label>
                        <div className="col-md-6">
                            <TimePicker
                                id="startTime"
                                showSecond={false}
                                defaultValue={this.state.selectedStartTime}
                                className="xxx"
                                onChange={this.handleStartTimeChange}
                                format={format}
                                value={this.state.selectedStartTime}
                                use12Hours
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="finishDate">Finish Date <span
                            className="text-danger">*</span></label>
                        <div className="col-md-6">
                            <DatePicker
                                className="form-control"
                                id="finishDate"
                                name="finishDate"
                                dateFormat="DD/MM/YYYY"
                                selected={this.state.finishDate}
                                onChange={this.handleFinishDateChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="finishTime">Finish Time <span
                            className="text-danger">*</span></label>
                        <div className="col-md-6">
                            <TimePicker

                                id="finishTime"
                                showSecond={false}
                                value={this.state.selectedFinishTime}
                                defaultValue={this.state.selectedFinishTime}
                                onChange={this.handleFinishTimeChange}
                                format={format}
                                use12Hours

                            />
                        </div>
                    </div>


                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="addressSearch">Address Search <span
                            className="text-danger">*&nbsp;</span> <span className="notimportant"><div className="notimportant"></div><i>(Please ensure you select an address using this Autocomplete field. You may then correct/complete
                        the address in the 'Full Address' field below)</i></span></label>
                        <div className="col-md-6">
                            <PlaceSearch
                                onSearchLocationChange={(lat, lng, address) => this.eventsSearch(lat, lng, address)}
                                searchType={searchType}
                            />
                        </div>
                    </div>


                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="address">Full Address <span
                            className="text-danger">*</span></label>
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                id="address"
                                name="address"
                                type="text"
                                value={this.state.address}
                                onChange={this.handleChange}
                                required/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="posterURL">
                            Poster URL <span className="notimportant"><div className="notimportant"></div><i>(Please upload your event poster to an image hosting website (e.g. www.imgur.com) and paste the URL to the image here)</i></span>
                        </label>
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                id="posterURL"
                                name="posterURL"
                                type="text"
                                value={this.state.posterURL}
                                onChange={this.handleChange}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="eventWebsite">Event Website</label>
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                id="eventWebsite"
                                name="eventWebsite"
                                type="text"
                                value={this.state.eventWebsite}
                                onChange={this.handleChange}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="contactPhone">
                            Contact Phone <span className="notimportant"><i>(This will be displayed on the published event page)</i></span>
                        </label>
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                id="contactPhone"
                                name="contactPhone"
                                type="text"
                                value={this.state.contactPhone}
                                onChange={this.handleChange}/>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="contactEmail">
                            Contact Email <span className="notimportant"><i>(This will be displayed on the published event page)</i></span>
                        </label>
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                value={this.state.contactEmail}
                                onChange={this.handleChange}/>
                        </div>
                    </div>


                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="emailAddress">
                            Your Email
                                <span className="text-danger">&nbsp;*&nbsp;</span>
                            <span className="notimportant"><i>(This will be kept private and you will only be contacted should we require further information)</i></span>


                        </label>
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                id="emailAddress"
                                name="emailAddress"
                                type="email"
                                value={this.state.emailAddress}
                                onChange={this.handleChange} required/>
                        </div>
                    </div>



                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="additionalInformation">Additional
                            Information <span className="notimportant"><i>(Any further information you wish to inform us about. This will not appear on the event page when published)</i></span>
                        </label>
                        <div className="col-md-6">
                    <textarea
                        className="form-control"
                        id="additionalInformation"
                        name="additionalInformation"
                        value={this.state.additionalInformation}
                        onChange={this.handleChange}
                        rows="3">
                    </textarea>

                        </div>
                    </div>


                    {(this.state.editMode == true || this.state.adminNewMode == true ) &&

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="approved">Approved</label>
                        <div className="col-md-6">
                            <select
                                className="form-control"
                                id="approved"
                                value={this.state.approved}
                                onChange={this.handleDropDown}
                            >
                                <option>true</option>
                                <option>false</option>
                            </select>
                        </div>
                    </div>

                    }


                    { (this.state.editMode == false && this.state.adminNewMode == false) &&

                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="message"></label>
                        <div className="col-md-6">
                            <ReCAPTCHA
                                ref="recaptcha"
                                sitekey={recaptchaKey}
                                onChange={this.onCaptchaChange}
                            />
                        </div>
                    </div>
                    }


                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="submitButton"></label>
                        <div className="col-md-6">
                            <input
                                type="submit"
                                id="submitButton"
                                value="Submit"
                                className="btn btn-primary"/>
                        </div>
                    </div>

                    <div>
                        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
                    </div>

                </fieldset>
            </form>
        );

    }

}

export default EventNew;