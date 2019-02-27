package com.localevents.restapi;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.localevents.domain.Event;
import com.localevents.domain.UserRole;
import com.localevents.exceptions.InvalidCaptchaException;
import com.localevents.service.CaptchaService;
import com.localevents.service.EventService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventsRestController {

    private EventService eventService;
    private CaptchaService captchaService;

    private final Logger LOG = LoggerFactory.getLogger(this.getClass());


    @Autowired
    public EventsRestController(EventService eventService, CaptchaService captchaService) {
        this.eventService = eventService;
        this.captchaService = captchaService;
    }


    @Secured({UserRole.ROLE_ADMIN})
    @RequestMapping(
            value = "/all",
            params = { "page", "size"},
            method = RequestMethod.GET
    )
    public Page<Event> getAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        return eventService.findAllByOrderByCreatedDateDesc(page, size);
    }

    /**
     * TODO if fail - differentiate between WEB api and this api
     * http://localhost:8080/events/59a092b040539b14bcac02b9
     * @param id
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public Event read(@PathVariable(value = "id") String id) throws Exception {

        Event event =  eventService.findOne(id);
        if (event == null) {
            LOG.error(String.format("Event with id %s does not exist", id));
            throw new Exception("Event with id: " + id + " not found");
        }

        return event;
    }

    @Secured({UserRole.ROLE_ADMIN})
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public Event update(@PathVariable(value = "id") String id, @RequestBody Event event) {
        return eventService.update(id, event);
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity create(@RequestBody Event event) {
        try {
            if (!event.getRecaptchaResponse().equals("IGNORE")) {
                captchaService.processResponse(event.getRecaptchaResponse());
            }
            eventService.create(event);
            return new ResponseEntity(HttpStatus.OK);
        } catch (InvalidCaptchaException e) {
            return new ResponseEntity(HttpStatus.FORBIDDEN);
        }
    }

    @Secured({UserRole.ROLE_ADMIN})
    @RequestMapping(value = "/jsonsubmit", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity createJsonEvent(@RequestBody Map<String, Object> payload) {

        String message = (String) payload.get("message");
        ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.enable(SerializationFeature.INDENT_OUTPUT);

        //Submit a single event from JSON
        /**try {
            Event e = mapper.readValue(message, Event.class);
            eventService.create(e);
        } catch (IOException e1) {
            LOG.error("error submitting custom json", e1);
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }**/

        //Parse list of files
        try {
            List<Event> newEvents = Arrays.asList(mapper.readValue(message, Event[].class));
            for (Event e : newEvents) {
                eventService.create(e);
            }

        } catch (IOException e1) {
            LOG.error("error submitting custom json", e1);
            return new ResponseEntity(HttpStatus.BAD_REQUEST);
        }

        return new ResponseEntity(HttpStatus.OK);
    }


    /**
     *  http://localhost:8080/events?page=0&size=10&lat=51.893084&lng=-1.137451&radius=50
     * @param page
     * @param size
     * @param lat
     * @param lng
     * @param radius
     * @return
     * @throws Exception
     */
    @RequestMapping(
            value = "",
            params = { "page", "size", "lat", "lng", "radius", "start", "end"},
            method = RequestMethod.GET
    )
    public Page<Event> getPagedEvents(@RequestParam("page") int page, @RequestParam("size") int size,
                             @RequestParam("lat") double lat, @RequestParam("lng") double lng,
                             @RequestParam("radius") int radius, @RequestParam("start") String start,
                                      @RequestParam("end") String end) throws Exception {

        Page<Event> resultPage = eventService.findPaginatedLocationNear(page, size, lat, lng, radius, start, end);

        if (page > resultPage.getTotalPages()) {
            LOG.error(String.format("Attempting to get a Page(%s) which is more than the total number of pages (%s)"));
            throw new Exception();
        }

        return resultPage;
    }


}
