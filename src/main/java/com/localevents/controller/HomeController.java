package com.localevents.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class HomeController {

    @RequestMapping(value = {"/", "/events/**", "/submitevent", "/event/**",
            "/login", "/adminpanel/**", "/contactus", "/faq", "/forgotpassword", "/resetpassword"})
    public String home() {
        return "index";
    }

}
