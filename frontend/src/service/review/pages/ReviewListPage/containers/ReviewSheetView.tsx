import React from 'react';

import { Question } from 'service/review/types';

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
          {questions.map((question: Question, index: number) => (
            <th key={index}>{question.questionValue}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {reviews.map(({ answers, nickname }: any, index: number) => {
          const answersTable = answers.map((answer: any, index: number) => (
            <td key={index}>{answer.answerValue}</td>
          ));

          return (
            <tr key={index}>
              <td>{nickname}</td>
              {answersTable}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ReviewSheetView;
