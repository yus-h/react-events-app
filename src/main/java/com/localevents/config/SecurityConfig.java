package com.localevents.config;

import com.localevents.authentication.CustomAuthenticationFilter;
import com.localevents.authentication.CustomFailureHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(securedEnabled = true) //https://docs.spring.io/spring-security/site/docs/3.2.8.RELEASE/reference/htmlsingle/#jc-method
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsService usersService;

    @Autowired
    public void configureAuth(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(usersService);
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(usersService).passwordEncoder(passwordEncoder());
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //start with a lockdown approach
        //start from bottom to up
        http.addFilterBefore(customUsernamePasswordAuthenticationFilter(), CustomAuthenticationFilter.class)
                .authorizeRequests()
                .antMatchers("/").permitAll()
                .antMatchers("/adminpanel/**").hasRole("ADMIN")
            .and()
            .formLogin()
                .defaultSuccessUrl("/adminpanel", true)
                .loginPage("/login")
                .usernameParameter("email")
                .permitAll()
            .and()
                .logout()
                .logoutSuccessUrl("/")
                .permitAll();

        //TODO: SEcurity temp disabled to test REST API
        // http.authorizeRequests().antMatchers("/**").permitAll();

        //https://stackoverflow.com/questions/21128058/invalid-csrf-token-null-was-found-on-the-request-parameter-csrf-or-header

        //Probably can get away ith CSRF disabling due to not using cookies
        //https://stackoverflow.com/questions/21357182/csrf-token-necessary-when-using-stateless-sessionless-authentication
        http.csrf().disable();
    }


    @Bean
    public AuthenticationFailureHandler trackerAuthFailureHandler(){
        CustomFailureHandler customFailureHandler= new CustomFailureHandler();
        return customFailureHandler;
    }


    @Bean
    public CustomAuthenticationFilter customUsernamePasswordAuthenticationFilter()
            throws Exception {
        CustomAuthenticationFilter customFilter = new CustomAuthenticationFilter();
        customFilter.setAuthenticationManager(authenticationManagerBean());

        customFilter.setAuthenticationFailureHandler(trackerAuthFailureHandler());

        return customFilter;
    }

}
