package com.localevents.restapi;

import com.localevents.domain.User;
import com.localevents.domain.UserRole;
import com.localevents.service.EmailService;
import com.localevents.service.UsersService;
import com.localevents.exceptions.PasswordChangeException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UsersRestController {

    private UsersService usersService;
    private EmailService emailService;
    private PasswordEncoder passwordEncoder;
    private final Logger LOG = LoggerFactory.getLogger(this.getClass());


    @Autowired
    public UsersRestController(UsersService usersService, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.usersService = usersService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @Secured({UserRole.ROLE_ADMIN})
    @RequestMapping(value = "/{email}/password", method = RequestMethod.PUT)
    @ResponseBody
    public ResponseEntity update(@PathVariable(value = "email") String email, @RequestBody Map<String, Object> payload) {

        String password = (String) payload.get("currentPassword");
        String newPassword = (String) payload.get("newPassword");
        String confirmPassword = (String) payload.get("confirmPassword");

        if (password == null || newPassword == null || confirmPassword == null) {
            return new ResponseEntity("Invalid fields", HttpStatus.FORBIDDEN);
        }

        try {
            usersService.changePassword(email, password, newPassword, confirmPassword);
            return new ResponseEntity(HttpStatus.OK);
        } catch (PasswordChangeException e) {
            LOG.error("Error changing password", e);
            return new ResponseEntity(e.getMessage(), HttpStatus.FORBIDDEN);
        }

    }

    @RequestMapping(value = "/{email}/forgotpassword", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity forgotpassword(@PathVariable(value = "email") String email, HttpServletRequest request) {

        User user = usersService.findByEmail(email);
        if (user == null) {
            return new ResponseEntity("Invalid email", HttpStatus.FORBIDDEN);
        }

        user.setResetToken(UUID.randomUUID().toString());
        usersService.save(user);

        String appUrl = request.getScheme() + "://" + request.getServerName();


        try {
            emailService.sendResetPasswordEmail(user, appUrl);
        } catch (MailException e) {
            LOG.error("Error sending email", e);
            return new ResponseEntity(e.getMessage(), HttpStatus.FORBIDDEN);
        }


        return new ResponseEntity(HttpStatus.OK);
    }



    @RequestMapping(value = "/resetpassword", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity resetpassword(@RequestBody Map<String, Object> payload) {


        String token = (String) payload.get("token");
        String newPassword = (String) payload.get("newPassword");
        String confirmPassword = (String) payload.get("confirmPassword");

        if (token.isEmpty()) {
            return new ResponseEntity("Invalid token", HttpStatus.FORBIDDEN);
        }

        if (newPassword == null || confirmPassword == null) {
            return new ResponseEntity("Invalid fields", HttpStatus.FORBIDDEN);
        }

        if (!newPassword.equals(confirmPassword)) {
            return new ResponseEntity("Passwords do not match", HttpStatus.FORBIDDEN);
        }

        User user = usersService.findByResetToken(token);
        if (user == null) {
            return new ResponseEntity("Cannot find user", HttpStatus.FORBIDDEN);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);

        usersService.save(user);
        return new ResponseEntity(HttpStatus.OK);
    }
}
