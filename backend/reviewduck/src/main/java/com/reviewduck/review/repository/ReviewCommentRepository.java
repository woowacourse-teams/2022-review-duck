package com.reviewduck.review.repository;


import com.reviewduck.review.domain.ReviewComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.repository.Repository;

public interface ReviewCommentRepository extends Repository<ReviewComment, Long> {
    Page<ReviewComment> findByReviewId(long reviewId, PageRequest pageRequest);
}
