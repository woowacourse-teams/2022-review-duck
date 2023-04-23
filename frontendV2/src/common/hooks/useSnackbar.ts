import snackbarStackAtom from 'common/recoil/snackbar';
import { useResetRecoilState, useSetRecoilState } from 'recoil';

import { SnackbarProps } from 'common/components/Snackbar/component';

function useSnackbar() {
  const resetSnackbar = useResetRecoilState(snackbarStackAtom);
  const setSnackbarStack = useSetRecoilState(snackbarStackAtom);

  const showSnackbar = (options: SnackbarProps) => {
    setSnackbarStack(({ uniqueKey, stack }) => {
      const newStack = [...stack];

      newStack.push({ ...options, key: uniqueKey });

      return { uniqueKey: uniqueKey + 1, stack: newStack };
    });
  };

  const removeSnackbar = (targetId: number) => {
    setSnackbarStack(({ uniqueKey, stack }) => {
      const newStack = [...stack].filter(({ key }) => key !== targetId);

      return { uniqueKey, stack: newStack };
    });
  };

  return { show: showSnackbar, remove: removeSnackbar, reset: resetSnackbar };
}

export default useSnackbar;
