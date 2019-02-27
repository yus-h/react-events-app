package com.localevents.repository;

import com.localevents.domain.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Date;

public interface EventRepository  extends MongoRepository<Event, String> {


    /**
     *
     * Today is 5PM
     * Event Started Yesterday and Finishes Today at 3PM
     * Still want to show that event until Tomorrow @ 1AM.
     *
     * Today is 5PM
     * Event starts tomorrow 9AM and finishes tomorrow 9AM
     * Want to show this.
     */
    Page<Event> findByLocationNearAndStartDateGreaterThanAndFinishDateLessThanAndApprovedTrueOrderByStartDateAsc(Point location, Distance distance, Date startDate, Date endDate, Pageable pageable);

    Event findById(String id);

    Page<Event> findAllByOrderByCreatedDateDesc(Pageable pageable);
}

