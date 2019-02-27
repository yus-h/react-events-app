package com.localevents.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ICalEvent {


    public ICalEvent() {

    }

    //UID
    @JsonProperty("SUMMARY")
    private String summary;
    //TODO Cut off everything after @


    @JsonProperty("DESCRIPTION")
    private String description;

    @JsonProperty("UID")
    private String uid;

    @JsonProperty("DTSTART;TZID=Europe/London")
    private String dateTimeStart;

    @JsonProperty("DTEND;TZID=Europe/London")
    private String dateTimeFinish; //IF finish not set, but start is, just set 2 hours after

    @JsonProperty("DTSTART;VALUE=DATE")
    private String dateStartAllDay;

    @JsonProperty("DTEND;VALUE=DATE")
    private String dateFinishAllDay;

    @JsonProperty("LOCATION")
    private String location;

    @JsonProperty("GEO")
    private String geo;

    @JsonProperty("X-WP-IMAGES-URL")
    private String imageURL;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getDateTimeStart() {
        return dateTimeStart;
    }

    public void setDateTimeStart(String dateTimeStart) {
        this.dateTimeStart = dateTimeStart;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDateTimeFinish() {
        return dateTimeFinish;
    }

    public void setDateTimeFinish(String dateTimeFinish) {
        this.dateTimeFinish = dateTimeFinish;
    }

    public String getDateStartAllDay() {
        return dateStartAllDay;
    }

    public void setDateStartAllDay(String dateStartAllDay) {
        this.dateStartAllDay = dateStartAllDay;
    }

    public String getDateFinishAllDay() {
        return dateFinishAllDay;
    }

    public void setDateFinishAllDay(String dateFinishAllDay) {
        this.dateFinishAllDay = dateFinishAllDay;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getGeo() {
        return geo;
    }

    public void setGeo(String geo) {
        this.geo = geo;
    }

    public String getImageURL() {
        return imageURL;
    }

    public void setImageURL(String imageURL) {
        this.imageURL = imageURL;
    }
}
