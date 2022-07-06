import FieldSet from 'common/components/FieldSet';
import cn from 'classnames';
import styles from './styles.module.scss';
import Button from 'common/components/Button';
import Icon from 'common/components/Icon';

import imageHero from 'assets/images/demo-create.png';

function JoinReviewPage() {
  return (
    <>
      <div className={cn(styles.container, 'flex-container column')}>
        <img className="" src={imageHero} alt="웰컴 메시지" />
      </div>
      <div className={cn(styles.container, 'flex-container column')}>
        <FieldSet title="참여 코드" description="회고 참여를 위한 코드를 입력해주세요.">
          <input type="text" placeholder="영문과 숫자로 이루어진 코드 8자리를 입력해주세요." />
        </FieldSet>

        <div className={cn('button-container horizontal')}>
          <Button size="medium" outlined>
            <Icon code="cancel"></Icon>
            취소하기
          </Button>
          <Button type="submit" size="medium">
            <Icon code="ads_click"></Icon>
            참여하기
          </Button>
        </div>
      </div>
    </>
  );
}

export default JoinReviewPage;
