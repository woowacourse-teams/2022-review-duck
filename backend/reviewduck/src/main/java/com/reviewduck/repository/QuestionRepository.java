package com.reviewduck.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.reviewduck.domain.Question;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
