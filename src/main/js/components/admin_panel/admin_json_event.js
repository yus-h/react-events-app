import React, {Component} from 'react';
import AlertContainer from 'react-alert';

const client = require('../../client');

const alertOptions = {
    offset: 14,
    position: 'bottom left',
    theme: 'dark',
    time: 5000,
    transition: 'scale'
};

class AdminJsonEvent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            message: "",
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
            path: '/api/events/jsonsubmit',
            entity: this.state,
            headers: {'Content-Type': 'application/json'}
        }).done(response => {
            if (response.status.code == 200) {
                this.showAlert('success', "Success!", 7000);
                this.setState({ message: "" });
            } else {
                this.showAlert('error', "Error! Please refresh the page and try again!", 3000);
            }
        }, response => {
            if (response.status.code === 403) {
                this.showAlert('error', "Error! Invalid captcha!", 3000);
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


    render() {

        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>

                <fieldset>

                    <legend>Add JSON Event</legend>


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
                                rows="15"
                                required>
                            </textarea>

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

export default AdminJsonEvent;