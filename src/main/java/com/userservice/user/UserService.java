package com.userservice.user;

import com.userservice.email.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
@SuppressWarnings("unused")
public class UserService {

    private final UserRepository repository;
    private final EmailService emailService;

    private static final String URL_EMAIL = "http://localhost:8080";

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

    public Mono<User> addUser(User user) {
        return repository.findByEmail(user.getEmail())
               .flatMap(u -> Mono.just((u.isEnabled()) ? u : (new User())))
               .switchIfEmpty(repository.save(user).flatMap(u -> {
                   user.setToken(Token.generate());
                   String tokenLink = String.format("%s/confirmEmail?token=%s", URL_EMAIL,
                           user.getToken().getToken());
                   Mono<Void> sentEmail = emailService.sendEmail(
                           user.getEmail(),
                           user.getName(),
                           tokenLink);
                   Mono<User> newUser = repository.save(user);
                   return Mono.when(newUser, sentEmail).then(newUser);
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

    public Mono<User> authenticateUser(String username, String password) {
        return repository.findById(username)
                .switchIfEmpty(Mono.error(new IllegalStateException("User not found")))
                .filter(user -> user.getPassword().equals(password))
                .switchIfEmpty(Mono.error(new IllegalStateException("Incorrect password")));
    }

    public Mono<Void> changePassword(String email){
        return repository.findByEmail(email)
                .switchIfEmpty(Mono.error(new IllegalStateException("Email not found")))
                .flatMap(user -> {
                    if(user.isLocked())
                        return Mono.error(new IllegalStateException("Account is locked"));
                    if(user.isEnabled()){
                        user.setOneTimePassword(OneTimePassword.generate());
                        String oneTimePassword = String.format("%s/changePassword.html?p=%s",
                                URL_EMAIL, user.getOneTimePassword().getOneTimePassword());
                        return emailService.sendEmail(user.getEmail(), user.getName(), oneTimePassword);
                    }
                    return Mono.error(new IllegalStateException("User not enabled"));
                });

    }



}
