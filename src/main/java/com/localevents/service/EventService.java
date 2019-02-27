package com.localevents.service;

import com.localevents.domain.Event;
import com.localevents.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import static com.localevents.domain.Constants.EMAIL_ADMIN_USER;

@Service
public class EventService {

    private EventRepository eventRepository;
    private EmailService emailService;

    @Autowired
    public EventService(EventRepository eventRepository, EmailService emailService) {
        this.eventRepository = eventRepository;
        this.emailService = emailService;
    }

     public List<Event> list() {
        return eventRepository.findAll();
    }

    //TODO proper tests.
    public Page<Event> findPaginatedLocationNear(int page, int size, double lat, double lng, int radius, String startDate, String endDate) {
        Point point =  new Point(lat, lng);

        //if start date + end date
        String start[] = startDate.split("-");
        Date eventStartDate = setupDate(start[0], start[1], start[2], 2);

        String end[] = endDate.split("-");
        Date eventEndDate = setupDate(end[0], end[1], end[2], 23);

        return eventRepository.findByLocationNearAndStartDateGreaterThanAndFinishDateLessThanAndApprovedTrueOrderByStartDateAsc(point,  new Distance(radius, Metrics.MILES), eventStartDate, eventEndDate, new PageRequest(page, size));
    }

    public static Date setupDate(String day, String month, String year, int hour) {
        Date date = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);

        cal.set(Calendar.YEAR, Integer.parseInt(year));
        cal.set(Calendar.MONTH, Integer.parseInt(month) - 1);
        cal.set(Calendar.DAY_OF_MONTH, Integer.parseInt(day));
        cal.set(Calendar.HOUR_OF_DAY, hour);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    public static Date removeTime(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 3);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

    public Event findOne(String id) {
        return eventRepository.findById(id);
    }

    public Event create(Event event) {



        Event newEvent = eventRepository.save(event);
        // Send an email if the admin didn't create it
        if (!newEvent.getEmailAddress().equals(EMAIL_ADMIN_USER)) {
            emailService.newEventEmail(newEvent);
        }


        return newEvent;


    }

    public Page<Event> findAllByOrderByCreatedDateDesc(int page, int size) {
        return eventRepository.findAllByOrderByCreatedDateDesc( new PageRequest(page, size));
    }

    public Event update(String id, Event updatedEvent) {

        Event currentEvent = eventRepository.findById(id);
        if(currentEvent != null ) {

            currentEvent.setTitle(updatedEvent.getTitle());
            currentEvent.setDescription(updatedEvent.getDescription());
            currentEvent.setStartDate(updatedEvent.getStartDate());
            currentEvent.setFinishDate(updatedEvent.getFinishDate());
            currentEvent.setPosterURL(updatedEvent.getPosterURL());
            currentEvent.setAddress(updatedEvent.getAddress());
            currentEvent.setLocation(updatedEvent.getLocation());
            currentEvent.setEventWebsite(updatedEvent.getEventWebsite());
            currentEvent.setContactEmail(updatedEvent.getContactEmail());
            currentEvent.setContactPhone(updatedEvent.getContactPhone());
            currentEvent.setApproved(updatedEvent.isApproved());
            currentEvent.setAdditionalInformation(updatedEvent.getAdditionalInformation());
            currentEvent.setEmailAddress(updatedEvent.getEmailAddress());

        }
        return eventRepository.save(currentEvent);

    }


}
