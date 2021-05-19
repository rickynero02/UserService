package com.userservice.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuppressWarnings("unused")
public class OneTimePassword {
    private String oneTimePassword;
    private LocalDateTime createAt;
    private LocalDateTime expireAt;
    private String passwd;

    public OneTimePassword(
                    String oneTimePassword,
                    LocalDateTime createAt,
                    LocalDateTime expireAt
                    ) {
            this.oneTimePassword = oneTimePassword;
            this.createAt = createAt;
            this.expireAt = expireAt;
    }

    public static OneTimePassword generate(){
        return new OneTimePassword(
                UUID.randomUUID().toString(),
                LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15),
                null);
    }
}
