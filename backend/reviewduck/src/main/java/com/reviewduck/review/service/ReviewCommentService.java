package com.reviewduck.review.service;

import com.reviewduck.review.domain.ReviewComment;
import com.reviewduck.review.dto.controller.response.ReviewCommentsResponse;
import com.reviewduck.review.repository.ReviewCommentRepository;
import com.reviewduck.review.vo.ReviewSortType;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@AllArgsConstructor
public class ReviewCommentService {

    private final ReviewCommentRepository reviewCommentRepository;
    public ReviewCommentsResponse findAll(long reviewId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, ReviewSortType.LATEST.getSortBy());
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<ReviewComment> reviewComments = reviewCommentRepository.findByReviewId(reviewId, pageRequest);
        return ReviewCommentsResponse.from(reviewComments);
    }
}
