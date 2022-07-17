import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import cn from 'classnames';

import Button from 'common/components/Button';
import FieldSet from 'common/components/FieldSet';
import Icon from 'common/components/Icon';
import TextBox from 'common/components/TextBox';

import imageHero from 'assets/images/demo-create.png';

import styles from './styles.module.scss';

function JoinReviewPage() {
  const [reviewFormCode, setReviewFormCode] = useState<string>('');
  const navigate = useNavigate();

  const REVIEW_FORM_CODE_LENGTH = 8;

  const checkValidation = (code: string) => {
    if (code.length !== REVIEW_FORM_CODE_LENGTH) {
      throw new Error('참여코드는 8자리를 입력해야 합니다.');
    }
    /* Q: 알파벳과 숫자로만 이루어져야 하는 등 검사도 해야 할까? */
  };

  const onSubmitReviewFormCode = (event: FormEvent) => {
    event.preventDefault();
    try {
      checkValidation(reviewFormCode);
      navigate(`/review-forms/submit/${reviewFormCode}`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className={cn(styles.container, 'flex-container column')}>
        <img className="" src={imageHero} alt="웰컴 메시지" />
      </div>
      <div className={cn(styles.container, 'flex-container column')}>
        <form onSubmit={onSubmitReviewFormCode}>
          <FieldSet title="참여 코드" description="회고 참여를 위한 코드를 입력해주세요.">
            <TextBox
              placeholder="영문과 숫자로 이루어진 코드 8자리를 입력해주세요."
              value={reviewFormCode}
              onChange={(event) => setReviewFormCode(event.target.value)}
            />
          </FieldSet>

          <div className={cn('button-container horizontal')}>
            <Button size="medium" theme="outlined">
              <Icon code="cancel" />
              <span>취소하기</span>
            </Button>
            <Button type="submit" size="medium" filled onClick={onSubmitReviewFormCode}>
              <Icon code="ads_click" />
              <span>참여하기</span>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}

export default JoinReviewPage;
