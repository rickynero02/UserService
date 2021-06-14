package com.userservice.user;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
@SuppressWarnings("unused")
public interface UserRepository extends ReactiveCrudRepository<User, String> {

    Mono<User> findByUsername(String username);

    Mono<User> findByEmail(String email);

    Mono<User> findByEmailOrUsername(String email, String username);

    @Query("{'token.param' : ?0}")
    Mono<User> findUserByToken(String token);

    @Query("{'oneTimePassword.param' : ?0}")
    Mono<User> findUserByOneTimePassword(String oneTimePassword);

}
