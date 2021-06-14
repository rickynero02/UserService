package com.userservice.user;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Optional;

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
    private int color;

    private EmailToken token = null;
    private PasswordToken oneTimePassword = null;
    private UserRoles role;
    private Payment payment;
    private boolean enabled = false;
    private boolean locked = false;

    public User(String username,
                String email,
                String name,
                String surname,
                String password,
                String role,
                Optional<Payment> pay,
                int color) {
        this.username = username;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.color = color;
        this.role = UserRoles.valueOf(role);
        this.payment = pay.orElse(null);
    }
}
