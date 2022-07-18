package com.reviewduck.service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.reviewduck.domain.Question;
import com.reviewduck.domain.ReviewForm;
import com.reviewduck.dto.request.QuestionRequest;
import com.reviewduck.dto.request.ReviewFormCreateRequest;
import com.reviewduck.dto.request.ReviewFormUpdateRequest;
import com.reviewduck.exception.NotFoundException;
import com.reviewduck.repository.QuestionRepository;
import com.reviewduck.repository.ReviewFormRepository;

@Service
@Transactional
public class ReviewFormService {

    private final ReviewFormRepository reviewFormRepository;
    private final QuestionRepository questionRepository;

    public ReviewFormService(ReviewFormRepository reviewFormRepository, QuestionRepository questionRepository) {
        this.reviewFormRepository = reviewFormRepository;
        this.questionRepository = questionRepository;
    }

    public ReviewForm save(ReviewFormCreateRequest createRequest) {
        List<String> questionValues = createRequest.getQuestions().stream()
            .map(QuestionRequest::getQuestionValue)
            .collect(Collectors.toUnmodifiableList());

        ReviewForm reviewForm = new ReviewForm(createRequest.getReviewTitle(), questionValues);
        return reviewFormRepository.save(reviewForm);
    }

    @Transactional(readOnly = true)
    public ReviewForm findByCode(String code) {
        return reviewFormRepository.findByCode(code)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 회고 폼입니다."));
    }

    public ReviewForm update(String code, ReviewFormUpdateRequest updateRequest) {
        ReviewForm reviewForm = findByCode(code);

        List<Question> questions = updateRequest.getQuestions().stream()
            .map(request -> saveOrUpdateQuestion(request.getQuestionId(), request.getQuestionValue()))
            .collect(Collectors.toUnmodifiableList());

        reviewForm.update(updateRequest.getReviewTitle(), questions);

        return reviewForm;
    }

    private Question saveOrUpdateQuestion(Long questionId, String questionValue) {
        if (Objects.isNull(questionId)) {
            return questionRepository.save(new Question(questionValue));
        }

        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new NotFoundException("존재하지 않는 질문입니다."));

        question.updateValue(questionValue);

        return question;
    }
}
