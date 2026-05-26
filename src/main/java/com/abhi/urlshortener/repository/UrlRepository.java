package com.abhi.urlshortener.repository;

import com.abhi.urlshortener.model.Url;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import com.abhi.urlshortener.model.User;
import java.util.List;

public interface UrlRepository extends JpaRepository<Url, Long> {
    Optional<Url> findByShortCode(String shortCode);
    List<Url> findByUserOrderByCreatedAtDesc(User user);
}