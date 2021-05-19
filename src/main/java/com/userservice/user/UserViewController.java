package com.userservice.user;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin
@Controller
@AllArgsConstructor
public class UserViewController {
    private final UserRepository repository;


}
