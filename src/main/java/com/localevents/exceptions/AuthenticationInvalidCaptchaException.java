package com.localevents.exceptions;

import org.springframework.security.core.AuthenticationException;

public class AuthenticationInvalidCaptchaException extends AuthenticationException {

    public AuthenticationInvalidCaptchaException(String msg) {
        super(msg);
    }
}
