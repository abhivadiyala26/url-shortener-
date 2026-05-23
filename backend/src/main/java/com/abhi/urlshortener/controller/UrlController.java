package com.abhi.urlshortener.controller;

import com.abhi.urlshortener.dto.UrlRequest;
import com.abhi.urlshortener.dto.UrlResponse;
import com.abhi.urlshortener.model.Url;
import com.abhi.urlshortener.model.User;
import com.abhi.urlshortener.service.UrlService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/url")
public class UrlController {

    @Autowired
    private UrlService service;

    @PostMapping("/shorten")
    public ResponseEntity<UrlResponse> shorten(
            @Valid @RequestBody UrlRequest request,
            @AuthenticationPrincipal User user
    ) {
        String shortCode = service.shortenUrl(request.getOriginalUrl(), request.getCustomAlias(), user);
        
        UrlResponse response = new UrlResponse(
                request.getOriginalUrl(),
                shortCode,
                0,
                LocalDateTime.now()
        );
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-urls")
    public ResponseEntity<List<UrlResponse>> getMyUrls(@AuthenticationPrincipal User user) {
        List<Url> urls = service.getMyUrls(user);
        
        List<UrlResponse> response = urls.stream()
                .map(url -> new UrlResponse(
                        url.getOriginalUrl(),
                        url.getShortCode(),
                        url.getClickCount(),
                        url.getCreatedAt()
                ))
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(response);
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats(@AuthenticationPrincipal User user) {
        List<Url> urls = service.getMyUrls(user);
        
        int totalLinks = urls.size();
        int totalClicks = urls.stream().mapToInt(Url::getClickCount).sum();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalLinks", totalLinks);
        stats.put("totalClicks", totalClicks);
        
        return ResponseEntity.ok(stats);
    }
}