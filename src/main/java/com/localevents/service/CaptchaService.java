package com.localevents.service;

import com.localevents.config.PropertiesConfig;
import com.localevents.helpers.GoogleResponse;
import com.localevents.exceptions.InvalidCaptchaException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestOperations;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.util.regex.Pattern;

@Service
public class CaptchaService {

    @Autowired
    private PropertiesConfig propertiesConfig;

    private RestOperations restTemplate =  new RestTemplate();

    private static Pattern RESPONSE_PATTERN = Pattern.compile("[A-Za-z0-9_-]+");

    public void processResponse(String response) throws InvalidCaptchaException {
        if(!responseSanityCheck(response)) {
            throw new InvalidCaptchaException("Response contains invalid characters");
        }

        URI verifyUri = URI.create(String.format(
                "https://www.google.com/recaptcha/api/siteverify?secret=%s&response=%s",
                getReCaptchaSecret(), response));

        GoogleResponse googleResponse = restTemplate.getForObject(verifyUri, GoogleResponse.class);
        if(!googleResponse.isSuccess()) {
            throw new InvalidCaptchaException("reCaptcha was not successfully validated");
        }
    }

    private boolean responseSanityCheck(String response) {
        return StringUtils.hasLength(response) && RESPONSE_PATTERN.matcher(response).matches();
    }

    public String getReCaptchaSecret() {
        return propertiesConfig.getVal();
    }


}