package com.userservice.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Token {

    private final static long MINUTES_FORWARD = 15;

    private String token;
    private LocalDateTime createdAt;
    private LocalDateTime expireAt;
    private LocalDateTime confirmedAt = null;

    public static Token generate() {
        return new Token(UUID.randomUUID().toString(),
                LocalDateTime.now(), LocalDateTime.now().plusMinutes(MINUTES_FORWARD),
                null);
    }

}
