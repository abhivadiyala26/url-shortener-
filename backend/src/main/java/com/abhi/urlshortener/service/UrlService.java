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

    public String shortenUrl(String originalUrl, String customAlias, LocalDateTime expiresAt, User user) {
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
        url.setExpiresAt(expiresAt);
        url.setUser(user);

        repository.save(url);

        return shortCode;
    }

    public String getOriginalUrl(String code) {
        Url url = repository.findByShortCode(code)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("URL has expired");
        }

        url.setClickCount(url.getClickCount() + 1);
        repository.save(url);

        return url.getOriginalUrl();
    }

    public void deleteUrl(String shortCode, User user) {
        Url url = repository.findByShortCode(shortCode)
                .orElseThrow(() -> new RuntimeException("URL not found"));

        if (url.getUser() == null || !url.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized to delete this URL");
        }

        repository.delete(url);
    }

    public List<Url> getMyUrls(User user) {
        return repository.findByUserOrderByCreatedAtDesc(user);
    }
}