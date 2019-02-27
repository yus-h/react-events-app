import React from 'react';
import { Link } from 'react-router-dom';
// import "../../../../../target/classes/static/event_list_item.css";
import "../../../resources/static/event_list_item.css";

import moment from 'moment';
import TextTruncate from 'react-text-truncate';

const EventListItem = ({event}) => {

    //TODO more efficient way to do this?


    let sameDay = moment(event.startDate).isSame(moment(event.finishDate), 'day');

    let startTimeFriendly;
    let finishTimeFriendly;

    if (sameDay) {
        startTimeFriendly = moment(event.startDate).format("h:mm a");
        finishTimeFriendly = moment(event.finishDate).format("h:mm a");
    } else {
        startTimeFriendly= moment(event.startDate).format('MMMM Do h:mm a');
        finishTimeFriendly = moment(event.finishDate).format('MMMM Do h:mm a');
    }


    const startDateDayOfMonth = moment(event.startDate).format("DD");
    const startDateMonth = moment(event.startDate).format("MMM");

    const createdDate = moment(event.createdDate);
    const threeDaysAgo = moment().subtract(3, 'day');
    const newlyAdded = createdDate.isAfter(threeDaysAgo);

    return (

        <li>
            <time>
                <span className="day">{startDateDayOfMonth}</span>
                <span className="month">{startDateMonth}</span>
            </time>

            {event.posterURL != null && event.posterURL != "" &&
            <img src={event.posterURL}/>
            }
            <Link to={"event/" + event.id} style={{textDecoration: 'none', color : 'black'}}>
                <div className="info">
                    <div className="title eventTitleSize">
                        <TextTruncate
                            line={1}
                            truncateText=" ..."
                            text={event.title}
                            textTruncateChild={""}
                        />
                    </div>
                    <div className="desc text-muted listitempadding">
                        {newlyAdded && <span className="badge badge-success">NEW</span> }
                        {!sameDay &&  <span className="badge badge-info">MULTIDAY</span>
                        }
                        <b> {startTimeFriendly} - {finishTimeFriendly} </b>
                        <br/>


                        <TextTruncate
                            line={1}
                            truncateText=" ..."
                            text={event.address}
                            textTruncateChild={""}
                        />

                        <TextTruncate
                            line={1}
                            truncateText=" ..."
                            text={event.description}
                            textTruncateChild={""}
                        />

                    </div>

                </div>
            </Link>
        </li>
    );


};

export default EventListItem;