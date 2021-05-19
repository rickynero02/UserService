package com.userservice.user;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@AllArgsConstructor
@Getter
@Setter
@Document
@NoArgsConstructor
public class User {

    @Id
    private String username;
    private String email;
    private String name;
    private String surname;
    private String password;
    private String image = "default";

    private Token token = null;
    private OneTimePassword oneTimePassword = null;
    private UserRoles role = UserRoles.STANDARD;
    private boolean enabled = false;
    private boolean locked = false;

    public User(String username,
                String email,
                String name,
                String surname,
                String password) {
        this.username = username;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
    }
}
