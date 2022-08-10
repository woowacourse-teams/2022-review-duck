import useSnackbar from 'common/hooks/useSnackbar';

import { Button } from 'common/components';

import { SnackbarProps } from 'common/components/Snackbar';

function Playground() {
  const { showSnackbar } = useSnackbar();
  const dummyAlert: SnackbarProps[] = [
    { title: '콤피는 자유를 원해요 🦖', description: '집 보내주세요 제발' },
    { title: '하디는 운동을 해야해요 💪', description: '집 보내주세요 제발', theme: 'danger' },
    { title: '주캉은 집에 좀 갔으면 좋겠어요', description: '제발 쉬어주세요', theme: 'warning' },
    { title: '스낵바 상태 컬러 끝', description: '기본, 경고, 위험, 성공 상태', theme: 'success' },
  ];

  return (
    <div style={{ height: '110vh', textAlign: 'right' }}>
      <Button onClick={() => showSnackbar(dummyAlert.splice(0, 1)[0])}>스낵바 켜줘</Button>
    </div>
  );
}

export default Playground;
