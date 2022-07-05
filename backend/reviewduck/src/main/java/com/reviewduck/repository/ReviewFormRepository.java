package com.reviewduck.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.domain.ReviewForm;

public interface ReviewFormRepository extends JpaRepository<ReviewForm, Long> {
}
