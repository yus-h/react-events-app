package com.localevents.authentication;

import com.localevents.exceptions.AuthenticationInvalidCaptchaException;
import com.localevents.exceptions.InvalidCaptchaException;
import com.localevents.service.CaptchaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    @Autowired
    private CaptchaService captchaService;

    private final Logger LOG = LoggerFactory.getLogger(this.getClass());


    public CustomAuthenticationFilter() {
        super();
        setRequiresAuthenticationRequestMatcher(new AntPathRequestMatcher("/login","POST"));
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        // TODO - currently disable reCAPTCHA

//        String captacha = request.getParameter("g-recaptcha-response");
//        LOG.info("Login attempt for " + request.getParameter("username"));
//
//        try {
//            captchaService.processResponse(captacha);
//        } catch (InvalidCaptchaException e) {
//            LOG.warn(String.format("Invalid captcha login attempt for user: %s", request.getParameter("username")));
//            throw new AuthenticationInvalidCaptchaException("invalid captcha");
//        }
        return super.attemptAuthentication(request, response);
    }

}