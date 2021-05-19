package com.userservice.user;

import com.userservice.utility.Message;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.Objects;


@RestController
@AllArgsConstructor
@CrossOrigin
public class UserController {

    private final UserService service;

    @GetMapping(path = "/api/v1/user/{username}")
    public Mono<Message> getUserByUsername(@PathVariable("username") String username) {
        return service.findByUsername(username)
                .map(user -> new Message().withElement("user", user))
                .onErrorResume(error -> Mono.just(new Message()
                        .withElement("error", error.getMessage())));
    }

    @PostMapping(path = "/signup")
    public Mono<Message> registerUser(@RequestBody User u) {
       return service.addUser(u)
               .map(result -> {
                   if(result.isEnabled()) {
                       return new Message().withElement("error", "User already exists");
                   }
                   return new Message().withElement("name", result.getName())
                           .withElement("surname", result.getSurname())
                           .withElement("username", result.getUsername());
               });
    }
}

