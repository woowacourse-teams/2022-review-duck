import FieldSet from 'common/components/FieldSet';
import cn from 'classnames';
import styles from './styles.module.scss';
import Button from 'common/components/Button';
import Icon from 'common/components/Icon';

function JoinReviewPage() {
  return (
    <>
      <div></div>
      <div className={cn(styles.container, 'flex-container column')}>
        <FieldSet title="참여 코드" description="회고 참여를 위한 코드를 입력해주세요.">
          <input type="text" />
        </FieldSet>

        <div className={cn('button-container horizontal')}>
          <Button type="submit" size="medium">
            <Icon code="ads_click"></Icon>
            참여하기
          </Button>
          <Button size="medium" outlined>
            <Icon code="cancel"></Icon>
            취소하기
          </Button>
        </div>
      </div>
    </>
  );
}

export default JoinReviewPage;
