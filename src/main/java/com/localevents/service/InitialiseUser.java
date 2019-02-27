package com.localevents.service;

import com.localevents.domain.*;
import com.localevents.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

import static com.localevents.domain.Constants.EMAIL_ADMIN_PASSWORD;
import static com.localevents.domain.Constants.EMAIL_ADMIN_USER;


@Service
public class InitialiseUser {

    private final UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public InitialiseUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    private void initDatabase() {

        User user = userRepository.findByEmail(EMAIL_ADMIN_USER);
        if (user == null) {
            //First time script is ran - create a user
            user = new User();
            user.setEmail(EMAIL_ADMIN_USER);
            user.setPassword(passwordEncoder.encode(EMAIL_ADMIN_PASSWORD));
            List<String> roles = new ArrayList<>();
            roles.add(UserRole.ROLE_ADMIN);
            user.setRoles(roles);
            userRepository.save(user);
        }
    }

}
