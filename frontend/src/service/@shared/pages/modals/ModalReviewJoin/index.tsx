import React from 'react';
import { useNavigate } from 'react-router-dom';

import useModal from 'common/hooks/useModal';

import { getErrorMessage } from 'service/@shared/utils';

import { Button, FieldSet, Icon, TextBox } from 'common/components';

import { MODAL_LIST, PAGE_LIST } from 'service/@shared/constants';
import { validateReviewFormCode } from 'service/@shared/validator';

function ModalReviewJoin() {
  const navigate = useNavigate();
  const { showModal, hideModal } = useModal();

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
    hideModal();
  };

  const onCancel = () => {
    showModal(MODAL_LIST.REVIEW_START);
  };

  return (
    <form onSubmit={onSubmitReviewFormCode}>
      <FieldSet title="참여 코드" description="회고 참여를 위한 코드를 입력해주세요.">
        <TextBox
          name="reviewFormCode"
          maxLength={8}
          placeholder="영문과 숫자로 이루어진 코드 8자리를 입력해주세요."
        />
      </FieldSet>

      <div className="button-container horizontal">
        <Button size="medium" theme="outlined" onClick={onCancel}>
          <Icon code="cancel" />
          <span>취소하기</span>
        </Button>

        <Button type="submit" size="medium" filled>
          <Icon code="ads_click" />
          <span>참여하기</span>
        </Button>
      </div>
    </form>
  );
}

export default ModalReviewJoin;
