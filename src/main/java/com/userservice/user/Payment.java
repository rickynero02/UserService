package com.userservice.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    private String cardNumber;
    private String ownerName;
    private String ownerSurname;
    private LocalDate dateExpire;
    private String cvv;
}
