package com.localevents.authentication;

import com.localevents.exceptions.AuthenticationInvalidCaptchaException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


public class CustomFailureHandler extends SimpleUrlAuthenticationFailureHandler {

    private final Logger LOG = LoggerFactory.getLogger(this.getClass());

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response, AuthenticationException exception)
            throws IOException, ServletException {


        if (exception.getClass().isAssignableFrom(AuthenticationInvalidCaptchaException.class)) {
            setDefaultFailureUrl("/login?invalidcaptcha");
        } else if (exception.getClass().isAssignableFrom(BadCredentialsException.class)) {
            setDefaultFailureUrl("/login?badcredentials");
            LOG.warn(String.format("Bad credentials for user %s", request.getParameter("username")));
        } else {
            setDefaultFailureUrl("/login?error");
            LOG.error("Unexpected error during login", exception);
        }


        super.onAuthenticationFailure(request, response, exception);
    }
}
