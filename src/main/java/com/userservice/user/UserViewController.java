package com.userservice.user;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import reactor.core.publisher.Mono;

@CrossOrigin
@Controller
@AllArgsConstructor
public class UserViewController {

    @GetMapping(path = "/index")
    public Mono<String> getIndex(){
        return Mono.just("redirect:index.html");
    }


}
