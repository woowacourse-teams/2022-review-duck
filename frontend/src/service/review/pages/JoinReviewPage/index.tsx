import { Link } from 'react-router-dom';

import cn from 'classnames';

import Button from 'common/components/Button';
import FieldSet from 'common/components/FieldSet';
import Icon from 'common/components/Icon';
import TextBox from 'common/components/TextBox';

import imageHero from 'assets/images/demo-create.png';

import styles from './styles.module.scss';

function JoinReviewPage() {
  return (
    <>
      <div className={cn(styles.container, 'flex-container column')}>
        <img className="" src={imageHero} alt="웰컴 메시지" />
      </div>
      <div className={cn(styles.container, 'flex-container column')}>
        <FieldSet title="참여 코드" description="회고 참여를 위한 코드를 입력해주세요.">
          <TextBox placeholder="영문과 숫자로 이루어진 코드 8자리를 입력해주세요." />
        </FieldSet>

        <div className={cn('button-container horizontal')}>
          <Button size="medium" theme="outlined">
            <Icon code="cancel" />
            <span>취소하기</span>
          </Button>
          <Link to={'/review'}>
            <Button type="submit" size="medium" filled>
              <Icon code="ads_click" />
              <span>참여하기</span>
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}

export default JoinReviewPage;
