import { useRef } from 'react';

import { useResetRecoilState, useSetRecoilState } from 'recoil';

import { SnackbarProps } from 'common/components/Snackbar';

import snackbarStackAtom from 'common/recoil/snackbar';

function useSnackbar() {
  const resetSnackbarStack = useResetRecoilState(snackbarStackAtom);
  const setSnackbarStack = useSetRecoilState(snackbarStackAtom);

  const snackbarUniqueId = useRef(0);

  const addSnackbarStack = (options: SnackbarProps) => {
    setSnackbarStack((currentValue) => {
      const newStack = [...currentValue];

      newStack.push({ ...options, id: snackbarUniqueId.current });
      snackbarUniqueId.current += 1;

      return newStack;
    });
  };

  const removeSnackbarStack = (targetId: number) => {
    setSnackbarStack((currentValue) => [...currentValue].filter(({ id }) => id !== targetId));
  };

  return { addSnackbarStack, removeSnackbarStack, resetSnackbarStack };
}

export default useSnackbar;
