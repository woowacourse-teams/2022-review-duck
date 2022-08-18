import React, { useState } from 'react';

import useModal from 'common/hooks/useModal';
import useSnackbar from 'common/hooks/useSnackbar';
import { useGetAuthProfile } from 'service/@shared/hooks/queries/auth';
import { useUpdateProfile } from 'service/@shared/hooks/queries/user/useUpdate';

import { Button, FieldSet, Icon, TextBox } from 'common/components';

import styles from './styles.module.scss';

function ModalProfileEdit() {
  const { hideModal } = useModal();
  const { showSnackbar } = useSnackbar();
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
    showSnackbar({
      title: '회원 정보를 수정했습니다.',
      description: '회원 정보는 마이페이지에서 언제든 수정할 수 있습니다.',
    });
    hideModal();
  };

  const handleEditError = ({ message }: Record<'message', string>) => {
    alert(message);
  };

  const handleEditProfile = () => {
    if (newNickname.length < 2) {
      alert('닉네임은 2 ~ 10자 이내로 작성해주세요.');
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
      <FieldSet
        size="large"
        title="닉네임 수정"
        description="10자 이내로 변경할 닉네임을 입력해주세요."
      >
        <TextBox
          minLength={2}
          maxLength={10}
          placeholder={nickname}
          value={newNickname}
          onChange={handleChangeNewNickname}
        />
      </FieldSet>
      <div className={styles.buttons}>
        <Button theme="outlined" onClick={hideModal}>
          <Icon code="cancel" />
          취소하기
        </Button>
        <Button onClick={handleEditProfile}>
          <Icon code="edit_note" />
          수정하기
        </Button>
      </div>
    </div>
  );
}

export default ModalProfileEdit;
