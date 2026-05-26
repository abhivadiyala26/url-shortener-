package com.abhi.urlshortener.dto;

import java.time.LocalDateTime;

public class UrlStatsResponse {

    private String shortCode;

    private String originalUrl;

    private int clickCount;

    private LocalDateTime createdAt;

    public UrlStatsResponse(
            String shortCode,
            String originalUrl,
            int clickCount,
            LocalDateTime createdAt
    ) {
        this.shortCode = shortCode;
        this.originalUrl = originalUrl;
        this.clickCount = clickCount;
        this.createdAt = createdAt;
    }

    public String getShortCode() {
        return shortCode;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public int getClickCount() {
        return clickCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}