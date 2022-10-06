package com.reviewduck.review.repository;


import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.reviewduck.review.domain.ReviewForm;

public interface TestReviewFormRepository extends Repository<ReviewForm, Long> {

    Optional<ReviewForm> findByCode(String code);
}
