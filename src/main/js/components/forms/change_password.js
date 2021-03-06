import React, {Component} from 'react';
const client = require('../../client');

class ChangePassword extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            successResults: null
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderFailure = this.renderFailure.bind(this);
        this.renderSuccess = this.renderSuccess.bind(this);

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

        console.log(this.state);

        client({
            method: 'PUT',
            path: '/api/users/' + this.state.email + "/password",
            entity: this.state,
            headers: {'Content-Type': 'application/json'}
        }).done(response => {
            if (response.status.code == 200) {
                this.setState({
                    successResults: this.renderSuccess()
                });

            } else {
                this.setState({
                    successResults: this.renderFailure()
                });
            }
        }, response => {
            this.setState({
                successResults: this.renderFailure(response.entity)
            });
        });
        e.preventDefault();
    }

    renderFailure(msg) {
        return (
            <div className="alert alert-danger" role="alert">
                <strong>Error! {msg} </strong>
            </div>
        )
    }

    renderSuccess() {
        return (
            <div className="alert alert-success" role="alert">
                <strong>Success!</strong>
            </div>
        )
    }


    render() {
        return (
            <div className="container">
                <div className="col-md-4 col-md-offset-4">

                    <form className="form-horizontal" onSubmit={this.handleSubmit}>

                        <fieldset>
                            <legend>Change Password</legend>

                        <div className="form-group">
                            <label className="col-md-4 control-label" htmlFor="email">Email</label>
                            <div className="col-md-6">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-4 control-label" htmlFor="currentPassword">Current Password</label>
                            <div className="col-md-6">
                                <input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    value={this.state.currentPassword}
                                    onChange={this.handleChange}/>
                            </div>
                        </div>


                        <div className="form-group">
                            <label className="col-md-4 control-label" htmlFor="newPassword">New Password</label>
                            <div className="col-md-6">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={this.state.newPassword}
                                    onChange={this.handleChange}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-4 control-label" htmlFor="confirmPassword">Confirm Password</label>
                            <div className="col-md-6">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={this.state.confirmPassword}
                                    onChange={this.handleChange}/>
                            </div>
                        </div>


                        <div className="form-group">
                            <label className="col-md-4 control-label" htmlFor="submitButton"></label>
                            <div className="col-md-8">
                                <input type="submit" id="submitButton" value="Submit" className="btn btn-success"/>
                            </div>
                        </div>

                        <div className='geocoding-results'>{this.state.successResults}</div>

                        </fieldset>

                    </form>
                </div>
            </div>
        );
    }
}

export default ChangePassword;
