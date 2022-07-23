import React from 'react';

import useGetReviewFormQuery from 'service/review/hooks/queries/useGetReviewFormQuery';
import useGetReviewsQuery from 'service/review/hooks/queries/useGetReviewsQuery';

import styles from '../styles.module.scss';

function ReviewSheetView({ reviewFormCode }: Record<'reviewFormCode', string>) {
  const {
    data: { reviews },
  } = useGetReviewsQuery(reviewFormCode);

  const {
    data: { questions },
  } = useGetReviewFormQuery(reviewFormCode);

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th></th>
          {questions.map((question: any, index: number) => (
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
