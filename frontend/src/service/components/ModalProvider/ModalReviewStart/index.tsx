import { useNavigate } from 'react-router-dom';

import {
  faArrowRightFromBracket,
  faFeatherPointed,
  faRightToBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, Text } from 'common/components';
import useModal from 'service/components/ModalProvider/useModal';

import { MODAL_LIST, PAGE_LIST } from 'constant';

import styles from './styles.module.scss';

function ModalReviewStart() {
  const navigate = useNavigate();
  const modal = useModal();

  const onClickCreateButton = () => {
    navigate(PAGE_LIST.REVIEW_FORM);
    modal.hide();
  };

  const onClickJoinButton = () => {
    modal.show({ key: MODAL_LIST.REVIEW_JOIN });
  };

  const onCancel = () => {
    modal.hide();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Text className={styles.description} size={14} weight="lighter">
          팀원과 함께 성장하세요!
        </Text>

        <Text className={styles.title} size={32} weight="bold">
          회고덕 시작하기
        </Text>
      </header>

      <main className={styles.actionContainer}>
        <div className={styles.actionButton} onClick={onClickCreateButton}>
          <FontAwesomeIcon className={styles.icon} icon={faFeatherPointed} />

          <div className={styles.info}>
            <Text className={styles.title} size={20} weight="bold">
              생성하기
            </Text>

            <Text className={styles.description} size={14}>
              회고 질문지를 생성하고 다른 사람들을 초대할 수 있어요!
            </Text>
          </div>
        </div>
        <div className={styles.actionButton} onClick={onClickJoinButton}>
          <FontAwesomeIcon className={styles.icon} icon={faRightToBracket} />

          <div className={styles.info}>
            <Text className={styles.title} size={20} weight="bold">
              참여하기
            </Text>

            <Text className={styles.description} size={14}>
              다른 사람이 생성한 회고 폼에 참여할 수 있습니다.
            </Text>
          </div>
        </div>
      </main>

      <Text className={styles.manualText} size={14}>
        작성한 회고는 마이페이지에 확인할 수 있습니다
      </Text>

      <footer className={styles.buttonContainer}>
        <Button theme="outlined" size="large" onClick={onCancel}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <span>다음에 회고하기</span>
        </Button>
      </footer>
    </div>
  );
}

export default ModalReviewStart;
