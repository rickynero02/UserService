package com.userservice.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@SuppressWarnings("unused")
public class PasswordToken extends Token {
    private String passwd;

    public PasswordToken() {
        super();
        passwd = null;
    }
}
