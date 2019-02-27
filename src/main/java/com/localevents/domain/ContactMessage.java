package com.localevents.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;


@Document(collection = "contactmessages")
public class ContactMessage {

    @Id
    private String id;

    @CreatedDate
    private Date createdDate;

    private String message;
    private String emailAddress;

    @Transient
    @JsonProperty("g-recaptcha-response")
    private String recaptchaResponse;

    public String getRecaptchaResponse() {
        return recaptchaResponse;
    }

    public void setRecaptchaResponse(String recaptchaResponse) {
        this.recaptchaResponse = recaptchaResponse;
    }

    public ContactMessage() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }


    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    @Override
    public String toString() {
        return "ContactMessage{" +
                "id='" + id + '\'' +
                ", createdDate=" + createdDate +
                ", message='" + message + '\'' +
                ", emailAddress='" + emailAddress + '\'' +
                ", recaptchaResponse='" + recaptchaResponse + '\'' +
                '}';
    }
}
