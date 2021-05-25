package com.userservice.user;

import com.userservice.email.EmailService;
import com.userservice.utility.Message;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@AllArgsConstructor
@SuppressWarnings("unused")
public class UserService {

    private final UserRepository repository;
    private final EmailService emailService;

    private static final String URL_EMAIL = "http://localhost:8080";

    //private static final String URL_EMAIL = "http://79.35.53.166:8080/api/v1/users";

    public Mono<User> findByUsername(String username) {
        return repository.findById(username)
                .switchIfEmpty(Mono.error(new IllegalStateException
                        (String.format("User %s not found!", username))));
    }

    public Mono<User> findByEmail(String email) {
        return repository.findByEmail(email)
                .switchIfEmpty(Mono.error(new IllegalStateException
                        (String.format("User with email %s does not exists!", email))));
    }

    public Mono<Void> resendEmail(String email){
        return repository.findByEmail(email)
                .switchIfEmpty(Mono.error(new IllegalStateException("Email not found")))
                .flatMap(user -> {
                    if(user.isEnabled())
                        return Mono.error(new IllegalStateException("Email already enabled"));
                    String url = String.format("%s/api/v1/users/confirmEmail?token=%s", URL_EMAIL, user.getToken().getParam());
                    return sendEmail(user, url,
                            "src/main/resources/static/send_conf_email.html").then();
                });
    }

    private Mono<User> sendEmail(User user, String url, String fileName){
        var newUser = repository.save(user);
        var emailSent = emailService.sendEmail(
                user.getEmail(),
                user.getName(),
                url,
                fileName);
        return Mono.when(newUser, emailSent).then(newUser);
    }

    public Mono<User> addUser(User user) {
        return repository.findByEmail(user.getEmail())
               .flatMap(u -> Mono.just((u.isEnabled()) ? u : (new User())))
               .switchIfEmpty(repository.save(user).flatMap(u -> {
                   user.setToken(new EmailToken());
                   String url = String.format("%s/api/v1/users/confirmEmail?token=%s", URL_EMAIL, user.getToken().getParam());
                   return sendEmail(u, url,
                           "src/main/resources/static/send_conf_email.html");
               }));
    }

    public Mono<User> confirmEmail(String token){
        return repository.findUserByToken(token)
                .switchIfEmpty(Mono.error(new IllegalStateException("Token not found")))
                .flatMap(user -> {
                    if(user.getToken().getExpireAt().isBefore(LocalDateTime.now()))
                        return Mono.error(new IllegalStateException("Token expired"));
                    if(user.isEnabled())
                        return Mono.error(new IllegalStateException("User already enabled"));
                    user.setEnabled(true);
                    user.getToken().setConfirmedAt(LocalDateTime.now());
                    return repository.save(user);
                });
    }

    public Mono<User> authenticateUser(String param, String password) {
        return repository.findByEmailOrUsername(param, param)
                .switchIfEmpty(Mono.error(new IllegalStateException("User not found")))
                .filter(user -> user.getPassword().equals(password))
                .switchIfEmpty(Mono.error(new IllegalStateException("Incorrect password")))
                .filter(User::isEnabled)
                .switchIfEmpty(Mono.error(new IllegalStateException("This user is not enabled")))
                .filter(user -> !user.isLocked())
                .switchIfEmpty(Mono.error(new IllegalStateException("This account is locked")));
    }

    public Mono<User> confirmChangePassword(String oneTimePassword, String passwd){
        return repository.findUserByOneTimePassword(oneTimePassword)
                .switchIfEmpty(Mono.error(new IllegalStateException("Change password not found")))
                .flatMap(user -> {
                    if(user.getOneTimePassword().getExpireAt().isBefore(LocalDateTime.now()))
                        return Mono.error(new IllegalStateException("Request expired"));
                    user.setOneTimePassword(null);
                    user.setPassword(passwd);
                    return repository.save(user);
                });
    }

    public Mono<User> changePassword(String email){
        return repository.findByEmail(email)
                .switchIfEmpty(Mono.error(new IllegalStateException("Email not found")))
                .filter(user -> !user.isLocked())
                .switchIfEmpty(Mono.error(new IllegalStateException("This account is locked")))
                .flatMap(user -> {
                    if(user.isLocked())
                        return Mono.error(new IllegalStateException("Account is locked"));
                    if(user.isEnabled()){
                        user.setOneTimePassword(new PasswordToken());
                        String url= String.format("%s/changePassword.html?p=%s",
                                URL_EMAIL, user.getOneTimePassword().getParam());
                        return sendEmail(user, url,
                                "src/main/resources/static/send_conf_pass.html");
                    }
                    return Mono.error(new IllegalStateException("User not enabled"));
                });
    }

    public Mono<Boolean> checkSessionValidity(WebSession session){
        return Mono.just(session.isStarted() && !session.isExpired());
    }

    public Mono<Message> getSessionParams(WebSession session){
        return Mono.just(new Message().withElement("attributes", session.getAttributes()));
    }

    public Mono<User> changeColorUser(User u){
        return repository.findByUsername(u.getUsername())
                .flatMap(user -> {
                    user.setColor(u.getColor());
                    return repository.save(user);
                }).switchIfEmpty(Mono.error(new IllegalArgumentException("User not found")));
    }

}
