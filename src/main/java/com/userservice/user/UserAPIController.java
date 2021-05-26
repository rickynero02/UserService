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
@RequestMapping("/api/v1/users")
public class UserAPIController {

    private final UserService service;

    @GetMapping(path = "/find/{username}")
    public Mono<Message> getUserByUsername(@PathVariable("username") String username) {
        return service.findByUsername(username)
                .map(user -> new Message().withElement("user", user))
                .onErrorResume(error -> Mono.just(new Message()
                        .withElement("error", error.getMessage())));
    }

    @GetMapping(path = "/resendEmail")
    public Mono<Message> resendEmail(@RequestParam String email){
        return service.resendEmail(email)
                .map(e -> new Message().withElement("result","sent"))
                .onErrorResume(error ->
                        Mono.just(new Message().withElement("error", error.getMessage())));
    }

    @GetMapping(path = "/confirmEmail")
    public Mono<Message> confirmEmail(@RequestParam String token){
        return service.confirmEmail(token)
                .map(user -> new Message().withElement("result", (user.isEnabled()) ? "ok" : "Not enabled")
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

    @GetMapping(path = "/checkSession")
    public Mono<Message> checkSession(WebSession session){
        return service.checkSessionValidity(session)
                .flatMap(s -> Mono.just(new Message().withElement("result", (s) ? "ok" : "lost")));
    }

    @GetMapping(path = "/getSessionParams")
    public Mono<Message> getSessionParams(WebSession session){
        return service.checkSessionValidity(session)
                .map(b -> new Message().withElement("result", (!b) ?
                        "SessionExpired" : session.getAttributes()));
    }

    @PostMapping(path = "/sendNewPassword")
    public Mono<Message> confirmChangePassword(@RequestBody PasswordToken oneTimePassword){
        return service.confirmChangePassword(
                oneTimePassword.getParam(),
                oneTimePassword.getPasswd())
                .map(o -> new Message().withElement("password","changed"))
                .onErrorResume(error ->
                        Mono.just(new Message().withElement("error",error.getMessage())));
    }

    @PostMapping(path = "/signin")
    public Mono<Message> loginUser(@RequestBody User u,
                                   WebSession session) {
        return service.authenticateUser(u.getUsername(), u.getPassword())
                .map(user -> {
                    session.getAttributes().put("username", user.getUsername());
                    session.getAttributes().put("name", user.getName());
                    session.getAttributes().put("surname", user.getSurname());
                    session.getAttributes().put("email", user.getEmail());
                    session.getAttributes().put("image", user.getImage());
                    session.getAttributes().put("color", user.getColor());
                    session.getAttributes().put("role", user.getRole().toString());
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
                               .withElement("username", result.getUsername())
                               .withElement("result","success");
                   }
               });
    }

    @PostMapping(path = "/changeColor")
    public Mono<Message> changeUserColor(@RequestBody User u, WebSession session){
        return service.checkSessionValidity(session)
                .map(m -> {
                    if (m) {
                        service.changeColorUser(u);
                        return new Message().withElement("result", "changed");
                    }else{
                        return new Message().withElement("result","sessionExpired");
                    }
                })
                .onErrorResume(error -> Mono.just(new Message().withElement("error", error.getMessage())));
    }

    @PostMapping(path = "/changeUserRole")
    public Mono<Message> changeUserRole(@RequestBody User u){
        return service.changeUserRole(u)
                .map(m -> new Message().withElement("result","success"))
                .onErrorResume(error -> Mono.just(new Message().withElement("error", error.getMessage())));
    }

    @PostMapping(path = "/changeUserPayment")
    public Mono<Message> changeUserPayment(@RequestBody User u){
        return service.changeUserPayment(u)
                .map(m -> new Message().withElement("result","success"))
                .onErrorResume(error -> Mono.just(new Message().withElement("error", error.getMessage())));
    }

}
