import React, { useState } from 'react';

import { faBan, faUserPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getErrorMessage } from 'utils';

import useSnackbar from 'common/hooks/useSnackbar';
import { useGetAuthProfile } from 'service/hooks/queries/auth';
import { useUpdateProfile } from 'service/hooks/queries/user/useUpdate';

import { Button, FieldSet, TextBox } from 'common/components';

import styles from './styles.module.scss';

import useModal from 'service/components/ModalProvider/useModal';
import { validateNickname } from 'service/validator';

function ModalProfileEdit() {
  const modal = useModal();
  const snackbar = useSnackbar();
  const [newNickname, setNewNickname] = useState('');

  const { data } = useGetAuthProfile();
  const updateProfile = useUpdateProfile();

  const { nickname } = data || {
    isMine: false,
    nickname: '',
    profileUrl: '',
    socialId: '',
    socialNickname: '',
  };

  const handleChangeNewNickname = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setNewNickname(target.value);
  };

  const handleEditSuccess = () => {
    snackbar.show({
      title: '회원 정보를 수정했습니다.',
      description: '회원 정보는 마이페이지에서 언제든 수정할 수 있습니다.',
    });
    modal.hide();
  };

  const handleEditError = ({ message }: Record<'message', string>) => {
    alert(message);
  };

  const handleEditProfile = () => {
    try {
      validateNickname(newNickname);
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      alert(errorMessage);
      return;
    }
    if (confirm(`${newNickname}으로 닉네임을 변경하시겠습니까?`)) {
      updateProfile.mutate(newNickname, {
        onSuccess: handleEditSuccess,
        onError: handleEditError,
      });
    }
  };

  return (
    <div className={styles.container}>
      <FieldSet>
        <FieldSet.Title size="large">닉네임 수정</FieldSet.Title>
        <TextBox
          minLength={2}
          maxLength={10}
          placeholder={nickname}
          value={newNickname}
          onChange={handleChangeNewNickname}
        />
        <FieldSet.Description>10자 이내로 변경할 닉네임을 입력해주세요.</FieldSet.Description>
      </FieldSet>

      <div className={styles.buttons}>
        <Button theme="outlined" onClick={modal.hide}>
          <FontAwesomeIcon icon={faBan} />
          취소하기
        </Button>
        <Button onClick={handleEditProfile}>
          <FontAwesomeIcon icon={faUserPen} />
          수정하기
        </Button>
      </div>
    </div>
  );
}

export default ModalProfileEdit;
