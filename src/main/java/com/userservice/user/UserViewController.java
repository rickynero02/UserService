package com.userservice.user;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import reactor.core.publisher.Mono;

@CrossOrigin
@Controller
@AllArgsConstructor
public class UserViewController {

    @GetMapping(path = "/index")
    public Mono<ResponseEntity<String>> getIndex(){
        return redirect("/index.html");
    }

    @GetMapping(path = "/register")
    public Mono<ResponseEntity<String>> getRegister(){
        return redirect("/register.html");
    }

    @GetMapping(path = "/login")
    public Mono<ResponseEntity<String>> getLogin(){
        return redirect("/login.html");
    }

    @GetMapping(path = "/verAccount")
    public Mono<ResponseEntity<String>> getVerAccount(){
        return redirect("/verAccount.html");
    }

    @GetMapping(path = "confirmCreation")
    public Mono<ResponseEntity<String>> getConfirCreation(){
        return redirect("/confirmCreation.html");
    }

    private Mono<ResponseEntity<String>> redirect(String path) {
        return Mono.just(new HttpHeaders())
                .doOnNext(header -> header.add("Location", path))
                .map(header -> new ResponseEntity<>(null, header, HttpStatus.MOVED_PERMANENTLY));
    }
}
