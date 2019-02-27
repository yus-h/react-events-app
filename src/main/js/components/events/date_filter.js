import React from 'react'
import DatePicker from 'react-datepicker';
import moment from 'moment';

class DateFilter extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            radius: 300,
            startDate: moment().hour(1).minute(0),
            endDate: moment().hour(1).minute(0).add(5, 'days'),
            selectedStartDate: moment().hour(1).minute(0),
            selectedEndDate: moment().hour(1).minute(0).add(5, 'days')

        }

        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);

    }

    componentWillReceiveProps(nextProps) {


        let selectedStart = nextProps.selectedStart;
        if (selectedStart != null) {
            //https://stackoverflow.com/questions/7151543/convert-dd-mm-yyyy-string-to-date
            let from = selectedStart.split("-");
            let f = new Date(from[2], from[1] - 1, from[0]);
            let newDate = moment(f);
            this.setState({selectedStartDate: newDate});
        }

        let selectedEnd = nextProps.selectedEnd;
        if (selectedEnd != null) {
            //https://stackoverflow.com/questions/7151543/convert-dd-mm-yyyy-string-to-date
            let from = selectedEnd.split("-");
            let f = new Date(from[2], from[1] - 1, from[0]);
            let newDate = moment(f);
            this.setState({selectedEndDate: newDate});
        }
    }


    handleChangeStart(date) {
        this.setState({
            startDate: date
        });

        this.props.onStartDateChanged(date);

    }

    handleChangeEnd(date) {
        this.setState({
            endDate: date
        });

        this.props.onEndDateChanged(date);

    }





    render() {
        return (

            <div>


                <div className="form-group">
                    <div class = "row">


                        <div className="col-sm-3 col-sm-offset-2 col-xs-12 text-right centredSmall">

                            <DatePicker className="form-control"
                                        selected={this.state.selectedStartDate}
                                        selectsStart
                                        startDate={this.state.selectedStartDate}
                                        endDate={this.state.selectedEndDate}
                                        onChange={this.handleChangeStart}
                                        dateFormat="DD/MM/YYYY"
                                        showMonthDropdown
                                        showYearDropdown

                            />
                        </div>

                        <div className="col-sm-2 col-xs-12 text-center">
                            to
                        </div>

                        <div className="col-sm-3 col-xs-12 text-left centredSmall">

                            <DatePicker className="form-control"
                                        selected={this.state.selectedEndDate}
                                        selectsEnd
                                        startDate={this.state.selectedStartDate}
                                        endDate={this.state.selectedEndDate}
                                        onChange={this.handleChangeEnd}
                                        dateFormat="DD/MM/YYYY"
                                        showMonthDropdown
                                        showYearDropdown

                            />
                        </div>
                    </div>
                </div>






            </div>

    )
    }
}

export default DateFilter;