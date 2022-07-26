package com.reviewduck.review.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.review.domain.ReviewForm;

public interface ReviewFormRepository extends JpaRepository<ReviewForm, Long> {
	Optional<ReviewForm> findByCode(String code);
}
