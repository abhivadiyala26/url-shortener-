package com.abhi.urlshortener;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UrlshortenerApplication {

    public static void main(String[] args) {

        SpringApplication.run(UrlshortenerApplication.class, args);

        System.out.println("\n=================================");
        System.out.println("Application Running Successfully");
        System.out.println("Open in Browser:");
        System.out.println("http://localhost:8080");
        System.out.println("=================================\n");
    }
}