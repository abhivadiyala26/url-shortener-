package com.abhi.urlshortener.dto;

import java.time.LocalDateTime;

public class UrlResponse {
    private String originalUrl;
    private String shortUrl;
    private int clickCount;
    private LocalDateTime createdAt;

    public UrlResponse() {}

    public UrlResponse(String originalUrl, String shortUrl, int clickCount, LocalDateTime createdAt) {
        this.originalUrl = originalUrl;
        this.shortUrl = shortUrl;
        this.clickCount = clickCount;
        this.createdAt = createdAt;
    }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getShortUrl() { return shortUrl; }
    public void setShortUrl(String shortUrl) { this.shortUrl = shortUrl; }

    public int getClickCount() { return clickCount; }
    public void setClickCount(int clickCount) { this.clickCount = clickCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
