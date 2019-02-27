package com.localevents.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;


@Component
@PropertySource("classpath:application.properties")
public class PropertiesConfig {

    private final String captchaServer;

    @Autowired
    public PropertiesConfig(@Value("${captcha.server}") String captchaServer) {
        this.captchaServer = captchaServer;
    }

    public String getVal() {
        return captchaServer;
    }
}