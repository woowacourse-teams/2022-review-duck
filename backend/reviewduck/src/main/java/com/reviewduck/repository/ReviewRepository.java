package com.reviewduck.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.domain.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
