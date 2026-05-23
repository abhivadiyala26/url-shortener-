package com.abhi.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;

public class UrlRequest {
    @NotBlank(message = "Original URL is required")
    private String originalUrl;
    
    private String customAlias;

    public UrlRequest() {}

    public UrlRequest(String originalUrl, String customAlias) {
        this.originalUrl = originalUrl;
        this.customAlias = customAlias;
    }

    public String getOriginalUrl() { return originalUrl; }
    public void setOriginalUrl(String originalUrl) { this.originalUrl = originalUrl; }

    public String getCustomAlias() { return customAlias; }
    public void setCustomAlias(String customAlias) { this.customAlias = customAlias; }
}
