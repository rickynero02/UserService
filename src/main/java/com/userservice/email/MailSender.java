package com.userservice.email;

import lombok.AllArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import javax.mail.internet.MimeMessage;

@Service
@AllArgsConstructor
public class MailSender {

    private final JavaMailSender javaMailSender;

    public Mono<Void> sendEmail(String to, String body) {
        return Mono.fromCallable(() -> {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");
            helper.setText(body, true);
            helper.setTo(to);
            helper.setSubject("CONFIRM EMAIL");
            helper.setFrom("filesharing.project02@gmail.com");
            javaMailSender.send(mimeMessage);
            return null;
        });
    }

}
