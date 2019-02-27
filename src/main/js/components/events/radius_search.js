import React from 'react'

class RadiusSearch extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            radius: 300
        }

        this.handleChange = this.handleChange.bind(this);

    }

    componentWillReceiveProps(nextProps) {

        let parentRadius = nextProps.radiusTest;

        if (parentRadius >= 300) {
            this.setState({radius: 300});
        } else if (parentRadius >= 100 && parentRadius < 300) {
            this.setState({radius: 100});
        } else if  (parentRadius >= 50 && parentRadius < 100) {
            this.setState({radius: 50});
        } else{
            this.setState({radius: 25});
        }
    }


    handleChange(event) {
        this.setState({radius: event.target.value});
        this.props.onRadiusChange(event.target.value);
    }

    render() {
        return (
            <select id="sel1" onChange={this.handleChange} value={this.state.radius} className="form-control">
                <option value="300">within 300 miles</option>
                <option value="100">within 100 miles</option>
                <option value="50">within 50 miles</option>
                <option value="25">within 25 miles</option>
            </select>
        )
    }
}

export default RadiusSearch;