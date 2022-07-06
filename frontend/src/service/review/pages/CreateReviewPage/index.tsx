import cn from 'classnames';
import styles from './styles.module.scss';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';

function CreateReviewPage() {
  return (
    <>
      <div></div>
      <div className={cn(styles.container)}>
        <h1>타이틀이 어쩌고</h1>
        <p>간단한 설명이 어쩌고</p>
        <div className={cn('button-container horizontal')}>
          <Button>
            <Icon code="add_circle"></Icon>
            회고 생성
          </Button>
          <Button>
            <Icon code="login"></Icon>
            회고 참여
          </Button>
        </div>
      </div>
    </>
  );
}

export default CreateReviewPage;
