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
      {snackbarActivityStack.map(({ id, ...rest }) => (
        <Snackbar key={id} {...rest} onDisappear={onSnackbarDisappear(id)} />
      ))}
    </div>
  );
}

export default SnackbarProvider;
