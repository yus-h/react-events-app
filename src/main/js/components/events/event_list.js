import React from 'react';
import EventListItem from './event_list_item';
// import "../../../../../target/classes/static/event_list_item.css";
import "../../../resources/static/event_list_item.css";

const EventList = (props) => {

    const eventItems = props.events.map((event) => {
        return (
            <EventListItem
                key={event.id}
                event={event}/>
        );
    });

    return (

        <div className="row">
            <div className="[ col-xs-12 col-sm-offset-2 col-sm-8 ]">
                <ul className="event-list">
                    {eventItems}
                </ul>
            </div>
        </div>

    );
};

export default EventList;