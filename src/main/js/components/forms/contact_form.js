import React, {Component} from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import AlertContainer from 'react-alert';

const client = require('../../client');

//const recaptchaKey = "6Ld1iS8UAAAAAI_z86HJJz7234JNbbANAM2UNJX4"; //dev
const recaptchaKey = "6Leoii8UAAAAAPeuTI0TNi1VdXmmsDUkwosG4iZ1"; //prod

const alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
};

class ContactForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: "",
            emailAddress: "",
            'g-recaptcha-response': ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);

    }

    /**
     * Called on the initial render of the component.
     */
    componentDidMount() {
        window.scrollTo(0, 0);
    }


    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }


    handleSubmit(e) {

        this.showAlert('info', "Submitting...");

        client({
            method: 'POST',
            path: '/api/contactmessages',
            entity: this.state,
            headers: {'Content-Type': 'application/json'}
        }).done(response => {
            if (response.status.code == 200) {
                this.setState({
                    message: "",
                    emailAddress: ""
                });

                this.showAlert('success', "Message Sent!");

            } else {
                this.showAlert('error', "Error! Please refresh the page and try again!");
            }
        }, response => {
            if (response.status.code === 403) {
                this.showAlert('error', "Error! Invalid captcha!");
            }
        });

        e.preventDefault();
    }

    showAlert (type, customMessage) {

        if (type == 'info') {
            this.msg.info(customMessage, {
                time: 2000,
                type: 'success'
            })
        } else if (type =='error') {
            this.msg.error(customMessage, {
                time: 2000,
                type: 'success'
            })
        } else {
            this.msg.success(customMessage, {
                time: 2000,
                type: 'success'
            })

        }

    }

    onChange(value) {
        this.setState({
            'g-recaptcha-response': value
        });
    }


    render() {

        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>

                <fieldset>

                    <legend>Contact Us</legend>


                    <div className="form-group">
                        <label className="col-md-4 control-label">
                        </label>
                        <div className="col-md-6">
                            Got a question or comment? Feel free to contact us here. Suggestions and features you would like to see
                            in future versions of this website are also welcome!
                        </div>
                    </div>


                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="emailAddress">
                            Your Email&nbsp;
                            <span className="text-danger">&nbsp;*</span>

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
                        <label className="col-md-4 control-label" htmlFor="message">Your Message <span
                            className="text-danger">*</span></label>
                        <div className="col-md-6">
                            <textarea
                                className="form-control"
                                id="message"
                                name="message"
                                value={this.state.message}
                                onChange={this.handleChange}
                                rows="7"
                                required>
                            </textarea>

                        </div>
                    </div>


                    <div className="form-group">
                        <label className="col-md-4 control-label" htmlFor="message"></label>
                        <div className="col-md-6">
                            <ReCAPTCHA
                                ref="recaptcha"
                                sitekey={recaptchaKey}
                                onChange={this.onChange}
                            />
                        </div>
                    </div>




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

export default ContactForm;