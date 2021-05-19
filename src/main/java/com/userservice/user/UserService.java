package com.userservice.user;

import com.userservice.email.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

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
               .switchIfEmpty(repository.save(user).flatMap(u -> {
                   user.setToken(Token.generate());
                   Mono<Void> sentEmail = emailService.sendEmail(user.getEmail(), user.getName(),
                           user.getToken().getToken());
                   Mono<User> newUser = repository.save(user);
                   return Mono.when(newUser, sentEmail).then(newUser);
                }));
    }
}
