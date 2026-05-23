package com.abhi.urlshortener.service;

import com.abhi.urlshortener.model.Url;
import com.abhi.urlshortener.model.User;
import com.abhi.urlshortener.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UrlService {

    @Autowired
    private UrlRepository repository;

    public String shortenUrl(String originalUrl, String customAlias, User user) {
        String shortCode;

        if (customAlias != null && !customAlias.isEmpty()) {
            shortCode = customAlias;

            // check if already exists
            repository.findByShortCode(shortCode).ifPresent(u -> {
                throw new RuntimeException("Alias already exists");
            });
        } else {
            shortCode = UUID.randomUUID().toString().substring(0, 6);
        }

        Url url = new Url();
        url.setOriginalUrl(originalUrl);
        url.setShortCode(shortCode);
        url.setCreatedAt(LocalDateTime.now());
        url.setClickCount(0);
        url.setUser(user);

        repository.save(url);

        return shortCode;
    }

    public String getOriginalUrl(String code) {
        Url url = repository.findByShortCode(code)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        url.setClickCount(url.getClickCount() + 1);
        repository.save(url);

        return url.getOriginalUrl();
    }

    public List<Url> getMyUrls(User user) {
        return repository.findByUserOrderByCreatedAtDesc(user);
    }
}