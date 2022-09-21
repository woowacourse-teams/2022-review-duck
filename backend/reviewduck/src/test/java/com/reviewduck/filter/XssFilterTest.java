// package com.reviewduck.filter;
//
// import static org.assertj.core.api.Assertions.*;
//
// import java.util.List;
//
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
//
// import com.reviewduck.acceptance.AcceptanceTest;
// import com.reviewduck.auth.support.JwtTokenProvider;
// import com.reviewduck.member.domain.Member;
// import com.reviewduck.member.service.MemberService;
// import com.reviewduck.review.dto.request.ReviewFormCreateRequest;
// import com.reviewduck.review.dto.request.ReviewFormQuestionCreateRequest;
// import com.reviewduck.review.dto.response.ReviewFormCodeResponse;
// import com.reviewduck.review.dto.response.ReviewFormResponse;
//
// public class XssFilterTest extends AcceptanceTest {
//
//     @Autowired
//     private MemberService memberService;
//
//     @Autowired
//     private JwtTokenProvider jwtTokenProvider;
//
//     @Test
//     @DisplayName("Xss 공격이 들어오면 변환하여 반환한다.")
//     void xssFilter() {
//         // given
//         Member member = new Member("1", "jason", "제이슨", "profileUrl");
//         Member savedMember = memberService.save(member);
//         String accessToken = jwtTokenProvider.createAccessToken(String.valueOf(savedMember.getId()));
//
//         String XssQuestionValue = "<script>alert(\"xss\")</script>; 👍";
//         List<ReviewFormQuestionCreateRequest> questions = List.of(
//             new ReviewFormQuestionCreateRequest(XssQuestionValue, XssQuestionValue),
//             new ReviewFormQuestionCreateRequest("question2", "description2"));
//         ReviewFormCreateRequest request = new ReviewFormCreateRequest("title", questions);
//
//         // when
//         String reviewFormCode = post("/api/review-forms", request, accessToken)
//             .extract()
//             .as(ReviewFormCodeResponse.class)
//             .getReviewFormCode();
//
//         String actual = get("/api/review-forms/" + reviewFormCode, accessToken)
//             .extract()
//             .as(ReviewFormResponse.class)
//             .getQuestions()
//             .get(0)
//             .getValue();
//
//         // then
//         assertThat(actual).isNotEqualTo(XssQuestionValue);
//     }
// }
