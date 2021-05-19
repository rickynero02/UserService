package com.userservice.email;

import lombok.AllArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@Service
@AllArgsConstructor
@Log
public class EmailService {

    //TODO: Trasferire il contenuto dell'email in un file

    private final MailSender mailSender;

    public Mono<Void> sendEmail(String email, String name, String param){
        return mailSender.sendEmail(email, getEmailText(name, param));
    }

    private String getEmailText (String fileName, String name, String link) {
        try {
            String content = Files.readString(Paths.get(fileName));
            return content.replace("{link}", link).replace("{name}", name);
        } catch (IOException ex) {
            log.severe(ex.getMessage());
            return "";
        }
    }

}
