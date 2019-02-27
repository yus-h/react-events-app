package com.localevents.authentication;

import com.localevents.domain.User;


public interface UserService {
    public User findByEmail(String email);

}

