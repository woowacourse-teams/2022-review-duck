import React from 'react';

import { Question, Review, Answer } from 'service/review/types';

import { useGetReviewForm, useGetReviews } from 'service/review/hooks/queries';

import styles from '../styles.module.scss';

function ReviewSheetView({ reviewFormCode }: Record<'reviewFormCode', string>) {
  const { data: reviewFormData } = useGetReviewForm(reviewFormCode);
  const { questions = [] } = reviewFormData || {};

  const { data: reviewsData } = useGetReviews(reviewFormCode);
  const { reviews = [] } = reviewsData || {};

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th></th>
          {questions.map((question: Question) => (
            <th key={question.questionId}>{question.questionValue}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {reviews.map(({ answers, participant, reviewId }: Review) => {
          const answersTable = answers.map((answer: Answer) => (
            <td key={reviewId}>{answer.answerValue}</td>
          ));

          return (
            <tr key={reviewId}>
              <td>{participant.nickname}</td>
              {answersTable}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ReviewSheetView;
