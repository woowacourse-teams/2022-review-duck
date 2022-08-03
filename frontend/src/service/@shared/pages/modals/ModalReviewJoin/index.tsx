import React from 'react';
import { useNavigate } from 'react-router-dom';

import useModal from 'common/hooks/useModal';

import { Button, FieldSet, Icon, TextBox } from 'common/components';

import { MODAL_LIST, PAGE_LIST } from 'service/@shared/constants';

function ModalReviewJoin() {
  const navigate = useNavigate();
  const { showModal, hideModal } = useModal();

  const REVIEW_FORM_CODE_LENGTH = 8;

  const checkValidation = (code: string) => {
    if (!code || code.length !== REVIEW_FORM_CODE_LENGTH) {
      throw new Error('참여코드는 8자리를 입력해야 합니다.');
    }
    /* Q: 알파벳과 숫자로만 이루어져야 하는 등 검사도 해야 할까? */
  };

  const onSubmitReviewFormCode = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const reviewFormCode = formData.get('reviewFormCode')?.toString() || '';

    try {
      checkValidation(reviewFormCode);
    } catch (error: any) {
      alert(error.message);
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
