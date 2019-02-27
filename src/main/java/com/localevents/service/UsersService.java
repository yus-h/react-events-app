package com.localevents.service;

import com.localevents.domain.User;
import com.localevents.repository.UserRepository;
import com.localevents.exceptions.PasswordChangeException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UsersService {

    private UserRepository usersRepository;

    @Autowired
    public UsersService(UserRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public void changePassword(String email, String password, String newPassword, String confirmPassword) throws PasswordChangeException {

        if (!newPassword.equals(confirmPassword)) {
            throw new PasswordChangeException("Passwords do not match");
        }

        User user = usersRepository.findByEmail(email);
        if (user == null) {
            throw new PasswordChangeException("User with email " + email + " does not exist");
        }

        if (!user.getPassword().equals(password)) {
            throw new PasswordChangeException("Current password is incorrect");
        } else {
            user.setPassword(newPassword);
            usersRepository.save(user);
        }
    }

    public User findByEmail(String email) {
        return usersRepository.findByEmail(email);
    }

    public User findByResetToken(String resetToken) {
        return usersRepository.findByResetToken(resetToken);
    }


    public User save(User user) {
        return usersRepository.save(user);
    }

}
