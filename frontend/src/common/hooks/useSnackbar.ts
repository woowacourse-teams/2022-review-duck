import { useRef } from 'react';

import { useResetRecoilState, useSetRecoilState } from 'recoil';

import { SnackbarProps } from 'common/components/Snackbar';

import snackbarStackAtom from 'common/recoil/snackbar';

function useSnackbar() {
  const resetSnackbar = useResetRecoilState(snackbarStackAtom);
  const setSnackbarStack = useSetRecoilState(snackbarStackAtom);

  const snackbarUniqueId = useRef(0);

  const addSnackbar = (options: SnackbarProps) => {
    setSnackbarStack((currentValue) => {
      const newStack = [...currentValue];

      newStack.push({ ...options, id: snackbarUniqueId.current });
      snackbarUniqueId.current += 1;

      return newStack;
    });
  };

  const removeSnackbar = (targetId: number) => {
    setSnackbarStack((currentValue) => [...currentValue].filter(({ id }) => id !== targetId));
  };

  return { addSnackbar, removeSnackbar, resetSnackbar };
}

export default useSnackbar;
