package com.reviewduck.review.dto.controller.response;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

import com.reviewduck.member.domain.Member;
import com.reviewduck.member.dto.response.MemberDto;
import com.reviewduck.review.domain.ReviewForm;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
public class MemberReviewFormsResponse {

    private long numberOfReviewForms;
    private boolean isLastPage;
    private boolean isMine;
    private List<MemberReviewFormResponse> reviewForms;

    public static MemberReviewFormsResponse of(Page<ReviewForm> reviewForms, String socialId, MemberDto member) {
        List<MemberReviewFormResponse> reviewFormResponses = reviewForms.getContent().stream()
            .map(MemberReviewFormResponse::from)
            .collect(Collectors.toUnmodifiableList());

        boolean isMine = member.getSocialId().equals(socialId);

        return new MemberReviewFormsResponse(
            reviewForms.getTotalElements(), reviewForms.isLast(), isMine, reviewFormResponses);
    }

    public boolean getIsMine() {
        return isMine;
    }

    public boolean getIsLastPage() {
        return isLastPage;
    }

}
