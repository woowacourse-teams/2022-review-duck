import React from 'react';
import { useNavigate } from 'react-router-dom';

import { faBan, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useModal from 'components/ModalProvider/useModal';
import { validateReviewFormCode } from 'validator';

import { Button, ButtonGroup, FieldSet, TextBox } from 'common/components';

import { MODAL_LIST, PAGE_LIST } from 'constant';
import { getErrorMessage } from 'utils';

import styles from './styles.module.scss';

function ModalReviewJoin() {
  const navigate = useNavigate();
  const modal = useModal();

  const onSubmitReviewFormCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const reviewFormCode = formData.get('reviewFormCode')?.toString() || '';

    try {
      validateReviewFormCode(reviewFormCode);
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      alert(errorMessage);
      return;
    }

    navigate(`${PAGE_LIST.REVIEW}/${reviewFormCode}`);
    modal.hide();
  };

  const onCancel = () => {
    modal.show({ key: MODAL_LIST.REVIEW_START });
  };

  return (
    <form onSubmit={onSubmitReviewFormCode}>
      <FieldSet className={styles.fieldSet}>
        <FieldSet.Title>참여 코드</FieldSet.Title>
        <TextBox
          name="reviewFormCode"
          maxLength={8}
          placeholder="영문과 숫자로 이루어진 코드 8자리를 입력해주세요."
        />
        <FieldSet.Description>회고 참여를 위한 코드를 입력해주세요.</FieldSet.Description>
      </FieldSet>

      <ButtonGroup>
        <Button size="medium" theme="outlined" onClick={onCancel}>
          <FontAwesomeIcon icon={faBan} />
          <span>취소하기</span>
        </Button>

        <Button type="submit" size="medium" filled>
          <FontAwesomeIcon icon={faRightToBracket} />
          <span>참여하기</span>
        </Button>
      </ButtonGroup>
    </form>
  );
}

export default ModalReviewJoin;
