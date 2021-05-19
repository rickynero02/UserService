package com.userservice.user;

import com.userservice.utility.Message;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

import java.util.Objects;


@RestController
@AllArgsConstructor
@CrossOrigin
public class UserServicesController {

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
        return service.changePassword(email)
                .map(user -> new Message().withElement("result", "Sent email"))
                .onErrorResume(error ->
                        Mono.just((new Message().withElement("error", error.getMessage()))));
    }

    @GetMapping(path = "/logout")
    public Mono<Message> logoutUser(WebSession session) {
        if(session.isStarted()) {
            var sessionResult = session.invalidate();
            var message = Mono.just(new Message().withElement("result", "Logout successfully"));
            return Mono.when(sessionResult, message).then(message);
        }

        return Mono.just(new Message().withElement("error", "User never logged"));
    }

    @PostMapping(path = "/sendNewPassword")
    public Mono<Message> confirmChangePassword(@RequestBody OneTimePassword oneTimePassword){
        return service.confirmChangePassword(
                oneTimePassword.getOneTimePassword(),
                oneTimePassword.getPasswd())
                .map(o -> new Message().withElement("password","changed"))
                .onErrorResume(error ->
                        Mono.just(new Message().withElement("error",error.getMessage())));
    }

    @PostMapping(path = "/login")
    public Mono<Message> loginUser(@RequestBody User u,
                                   WebSession session) {
        return service.authenticateUser(u.getUsername(), u.getPassword())
                .map(user -> {
                    session.getAttributes().put("username", user.getUsername());
                    session.getAttributes().put("name", user.getName());
                    return new Message().withElement("result", "Login successfully");
                })
                .onErrorResume(error -> Mono.just(new Message().withElement("error", error.getMessage())));

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
