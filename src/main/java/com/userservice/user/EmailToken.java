package com.userservice.user;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class EmailToken extends Token {
    private LocalDateTime confirmedAt;

    public EmailToken() {
        super();
        confirmedAt = null;
    }
}
