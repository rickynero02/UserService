package com.userservice.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
public abstract class Token {

    protected String param;
    private LocalDateTime createAt;
    private LocalDateTime expireAt;

    private final static long MINUTES_DEFAULT = 15L;

    public Token() {
        param = UUID.randomUUID().toString();
        createAt = LocalDateTime.now();
        expireAt = LocalDateTime.now().plusMinutes(MINUTES_DEFAULT);
    }

    public Token(long delay) {
        param = UUID.randomUUID().toString();
        createAt = LocalDateTime.now();
        expireAt = LocalDateTime.now().plusMinutes(delay);
    }
}
