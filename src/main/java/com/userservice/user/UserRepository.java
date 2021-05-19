package com.userservice.user;

import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.reactive.ReactiveCrudRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
@SuppressWarnings("unused")
public interface UserRepository extends ReactiveCrudRepository<User, String> {

    Mono<User> findByEmail(String email);

    @Query("{'token.token' : ?0}")
    Mono<User> findUserByToken(String token);

    @Query("{'oneTimePassword.oneTimePassword'}")
    Mono<User> findUserByOneTimePassword(String oneTimePassword);

}
