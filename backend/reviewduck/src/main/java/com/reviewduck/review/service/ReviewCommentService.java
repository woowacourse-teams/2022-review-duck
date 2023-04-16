package com.reviewduck.review.service;

import com.reviewduck.common.exception.NotFoundException;
import com.reviewduck.member.domain.Member;
import com.reviewduck.member.repository.MemberRepository;
import com.reviewduck.review.domain.ReviewComment;
import com.reviewduck.review.dto.controller.request.ReviewCommentCreateRequest;
import com.reviewduck.review.dto.controller.request.ReviewCommentUpdateRequest;
import com.reviewduck.review.dto.controller.response.ReviewCommentsResponse;
import com.reviewduck.review.repository.ReviewCommentRepository;
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
    private final MemberRepository memberRepository;

    public ReviewCommentsResponse findAll(long reviewId, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.ASC, "updatedAt");
        PageRequest pageRequest = PageRequest.of(page, size, sort);

        Page<ReviewComment> reviewComments = reviewCommentRepository.findByReviewId(reviewId, pageRequest);
        return ReviewCommentsResponse.from(reviewComments);
    }

    @Transactional
    public long save(long memberId, long reviewId, ReviewCommentCreateRequest request) {
        Member member = findMemberById(memberId);
        ReviewComment reviewComment = new ReviewComment(reviewId, memberId, request.getContent());
        return reviewCommentRepository.save(reviewComment).getId();
    }

    @Transactional
    public void update(long memberId, long commentId, ReviewCommentUpdateRequest request) {
        ReviewComment reviewComment = reviewCommentRepository.findById(commentId);
        if (!reviewComment.isCommenter(memberId)) throw new IllegalArgumentException("댓글 작성자가 아니면 수정할 수 없습니다.");
        reviewComment.update(request.getContent());
    }

    @Transactional
    public void delete(long memberId, long commentId) {
        ReviewComment reviewComment = reviewCommentRepository.findById(commentId);
        if (!reviewComment.isCommenter(memberId)) throw new IllegalArgumentException("댓글 작성자가 아니면 삭제할 수 없습니다.");
        reviewCommentRepository.delete(reviewComment);
    }

    private Member findMemberById(long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new NotFoundException("존재하지 않는 사용자입니다."));
    }
}
