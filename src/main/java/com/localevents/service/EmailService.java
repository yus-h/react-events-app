package com.localevents.service;

import com.localevents.domain.ContactMessage;
import com.localevents.domain.Event;
import com.localevents.domain.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import static com.localevents.domain.Constants.EMAIL_FROM_ADDRESS;
import static com.localevents.domain.Constants.EMAIL_TO_ADDRESS;

@Service
public class EmailService {

    private JavaMailSender javaMailSender;

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendResetPasswordEmail(User user, String appUrl) throws MailException {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(user.getEmail());
        mail.setFrom(EMAIL_FROM_ADDRESS);

        //TODO port
        String resetLink = appUrl + "/resetpassword?token=" + user.getResetToken();

        mail.setSubject("Password reset link");
        mail.setText("To reset your password, click the link below:\n " + resetLink);

        javaMailSender.send(mail);
    }

    @Async
    public void forwardConcactMessage(ContactMessage contactMessage) throws MailException {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(EMAIL_TO_ADDRESS);
        mail.setFrom(EMAIL_FROM_ADDRESS);

        mail.setSubject("[FWD:LOCALEVENTS.com] - replyto:" + contactMessage.getEmailAddress());
        mail.setText(contactMessage.getMessage());

        javaMailSender.send(mail);
    }

    @Async
    public void newEventEmail(Event event) throws MailException {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(EMAIL_TO_ADDRESS);
        mail.setFrom(EMAIL_FROM_ADDRESS);

        mail.setSubject("[NEWEVENT] " + event.getTitle());
        mail.setText("http://www.localevents.com/adminpanel/events/" + event.getId());

        javaMailSender.send(mail);
    }



}
