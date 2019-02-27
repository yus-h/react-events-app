import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
const client = require('../../client');
const recaptchaKey = "KEY"; //prod

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            // 'g-recaptcha-response': ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.onChange = this.onChange.bind(this);
        //READ url for error message
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    // TODO commenting out recaptcha for now
    onChange(value) {
        // this.setState({
        //     'g-recaptcha-response': value
        // });
    }


    render() {
        return (
            <div className="container">

                <div className="col-md-4 col-md-offset-4">

                    <form className="form-horizontal" method="post" action="login">

                        <fieldset>
                            <legend>Login</legend>

                        <div className="form-group">
                            <label className="col-md-4 control-label" htmlFor="username">Email</label>
                            <div className="col-md-6">
                                <input
                                    id="username"
                                    name="username"
                                    type="email"
                                    value={this.state.username}
                                    onChange={this.handleChange}/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-4 control-label" htmlFor="password">Password</label>
                            <div className="col-md-6">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}/>
                            </div>
                        </div>


                        <div className="form-group">
                            <label className="col-md-4 control-label" htmlFor="message"></label>
                            <div className="col-md-6">
                                {/*<ReCAPTCHA*/}
                                    {/*ref="recaptcha"*/}
                                    {/*sitekey={recaptchaKey}*/}
                                    {/*onChange={this.onChange}*/}
                                {/*/>*/}
                            </div>
                        </div>


                        <div className="form-group">
                            <label className="col-md-4 control-label" htmlFor="submitButton"></label>
                            <div className="col-md-8">
                                <input type="submit" id="submitButton" value="Submit" className="btn btn-success"/>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="col-md-4 control-label"></label>
                            <div className="col-md-6">
                                <Link to="/forgotpassword">Forgot Password</Link>
                            </div>
                        </div>


                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginForm;
