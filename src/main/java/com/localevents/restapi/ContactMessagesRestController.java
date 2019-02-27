package com.localevents.restapi;

import com.localevents.domain.ContactMessage;
import com.localevents.domain.UserRole;
import com.localevents.service.CaptchaService;
import com.localevents.service.ContactMessageService;
import com.localevents.exceptions.InvalidCaptchaException;
import com.localevents.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/contactmessages")
public class ContactMessagesRestController {

    private ContactMessageService contactMessageService;
    private CaptchaService captchaService;
    private EmailService emailService;

    @Autowired
    public ContactMessagesRestController(ContactMessageService contactMessageService, CaptchaService captchaService, EmailService emailService) {
        this.contactMessageService = contactMessageService;
        this.captchaService = captchaService;
        this.emailService = emailService;
    }


    @Secured({UserRole.ROLE_ADMIN})
    @RequestMapping(
            value = "",
            params = { "page", "size"},
            method = RequestMethod.GET
    )
    public Page<ContactMessage> getAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        return contactMessageService.findAllByOrderByCreatedDateDesc(page, size);
    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity create(@RequestBody ContactMessage contactMessage, HttpServletRequest request) throws Exception, InvalidCaptchaException {

        try {
            captchaService.processResponse(contactMessage.getRecaptchaResponse());
            contactMessageService.create(contactMessage);

            emailService.forwardConcactMessage(contactMessage);


            //send emai
            return new ResponseEntity(HttpStatus.OK);
        } catch (InvalidCaptchaException e) {
            return new ResponseEntity(HttpStatus.FORBIDDEN);
        }
    }
}
