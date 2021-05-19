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

    @GetMapping(path = "/confirmEmail")
    public Mono<Message> confirmEmail(@RequestParam String token){
        return service.confirmEmail(token)
                .map(user -> new Message().withElement("enabled", user.isEnabled())
                        .withElement("email", user.getEmail())
                        .withElement("passwd", user.getPassword()))
                .onErrorResume(error -> Mono.just(new Message()
                        .withElement("error", error.getMessage())));
    }

    @GetMapping(path = "/changePassword")
    public Mono<Message> changePassword(@RequestParam String email){
        return service.changePassword(email).map(e ->
                new Message().withElement("email","sent"))
                .onErrorResume(error ->
                        Mono.just((new Message().withElement("error", error.getMessage()))));
    }

    @PostMapping(path = "/signup")
    public Mono<Message> registerUser(@RequestBody User u) {
       return service.addUser(u)
               .map(result -> {
                   if(result.isEnabled()) {
                       return new Message().withElement("error", "User with this email already exists");
                   } else if(Objects.isNull(result.getEmail())) {
                       return new Message().withElement("error", "User must be confirmed");
                   } else {
                       return new Message().withElement("name", result.getName())
                               .withElement("surname", result.getSurname())
                               .withElement("username", result.getUsername());
                   }
               });
    }
}
