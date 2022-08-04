import { useRecoilValue } from 'recoil';

import useSnackbar from 'common/hooks/useSnackbar';

import Snackbar from 'common/components/Snackbar';

import { snackbarStackWithActive } from 'common/recoil/snackbar';

function SnackbarProvider() {
  const snackbarActivityStack = useRecoilValue(snackbarStackWithActive);
  const { removeSnackbar } = useSnackbar();

  const onSnackbarDisappear = (snackbarId: number) => () => {
    removeSnackbar(snackbarId);
  };

  return (
    <div id="snackbar-container">
      {snackbarActivityStack.map(({ key, ...rest }) => (
        <Snackbar key={key} {...rest} onDisappear={onSnackbarDisappear(key)} />
      ))}
    </div>
  );
}

export default SnackbarProvider;
