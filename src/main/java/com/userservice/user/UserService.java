package com.userservice.user;

import com.userservice.email.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.WebSession;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
@SuppressWarnings("unused")
public class UserService {

    private final UserRepository repository;
    private final EmailService emailService;

    //private static final String URL_EMAIL = "http://localhost:8080";

    private static final String URL_EMAIL = "http://79.35.53.166:8080";

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
                .switchIfEmpty(Mono.error(new IllegalStateException("email not found")))
                .flatMap(user ->{
                    if(user.isEnabled())
                        return Mono.error(new IllegalStateException("email already enabled"));
                    return sendEmail(user);
                });
    }

    private Mono<Void> sendEmail(User user){
        user.setToken(Token.generate());
        String tokenLink = String.format("%s/confirmCreation.html?token=%s",
                URL_EMAIL, user.getToken().getToken());
        var newUser = repository.save(user);
        var emailSent = emailService.sendEmail(
                user.getEmail(),
                user.getName(),
                tokenLink,
                "src/main/resources/static/send_conf_email.html");
        return Mono.when(newUser, emailSent).then();
    }

    public Mono<User> addUser(User user) {
        return repository.findByEmail(user.getEmail())
               .flatMap(u -> Mono.just((u.isEnabled()) ? u : (new User())))
               .switchIfEmpty(repository.save(user).flatMap(u -> {
                   var update = sendEmail(user);
                   var monoUser = Mono.just(u);
                   return Mono.when(update, monoUser).then(monoUser);
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
                .switchIfEmpty(Mono.error(new IllegalStateException("change password not found")))
                .flatMap(user -> {
                    if(user.getOneTimePassword().getExpireAt().isBefore(LocalDateTime.now()))
                        return Mono.error(new IllegalStateException("request expired"));
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
                        user.setOneTimePassword(OneTimePassword.generate());
                        String oneTimePassword = String.format("%s/changePassword.html?p=%s",
                                URL_EMAIL, user.getOneTimePassword().getOneTimePassword());
                        var emailSent = emailService.sendEmail(
                                user.getEmail(), user.getName(),
                                oneTimePassword,"src/main/resources/static/send_conf_pass.html");
                        var savedUser = repository.save(user);
                        return Mono.when(savedUser, emailSent).then(savedUser);
                    }
                    return Mono.error(new IllegalStateException("User not enabled"));
                });
    }

    public Mono<Boolean> checkSessionValidity(WebSession session){
        return Mono.just(session.isStarted() && !session.isExpired());
    }




}
