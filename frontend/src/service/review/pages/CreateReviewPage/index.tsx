import cn from 'classnames';
import styles from './styles.module.scss';
import Button from 'common/components/Button';
import Icon from 'common/components/Icon';

import imageHero from 'assets/images/demo-create.png';

function CreateReviewPage() {
  return (
    <>
      <div className={cn(styles.container)}>
        <img className="" src={imageHero} alt="웰컴 메시지" />
      </div>
      <div className={cn(styles.container)}>
        <h1 className={cn(styles.title)}>회고를 통해 팀원과 함께 성장하세요!</h1>
        <p className={cn(styles.subtitle)}>
          팀원과 공유할 회고 질문을 작성하고 팀원들에게 참여 코드를 공유하시면 팀원들의 회고를
          간편하게 모아 볼 수 있습니다
        </p>
        <div className={cn('button-container horizontal')}>
          <Button>
            <Icon type="outlined" code="maps_ugc" />
            <span>회고 생성</span>
          </Button>
          <Button>
            <Icon code="login" />
            <span>회고 참여</span>
          </Button>
        </div>
      </div>
    </>
  );
}

export default CreateReviewPage;
