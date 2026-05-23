package com.abhi.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class UrlRequest {
    @NotBlank(message = "Original URL is required")
    private String originalUrl;
    
    private String customAlias;
    private LocalDateTime expiresAt;

    public UrlRequest() {}

    public UrlRequest(String originalUrl, String customAlias, LocalDateTime expiresAt) {
        this.originalUrl = originalUrl;
        this.customAlias = customAlias;
        this.expiresAt = expiresAt;
    }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getCustomAlias() { return customAlias; }
    public void setCustomAlias(String customAlias) { this.customAlias = customAlias; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
}
