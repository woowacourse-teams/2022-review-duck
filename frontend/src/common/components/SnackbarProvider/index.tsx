import { snackbarStackWithActive } from 'common/recoil/snackbar';
import { useRecoilValue } from 'recoil';

import useSnackbar from 'common/hooks/useSnackbar';

import Snackbar from 'common/components/Snackbar';

function SnackbarProvider() {
  const snackbarActivityStack = useRecoilValue(snackbarStackWithActive);
  const snackbar = useSnackbar();

  const onSnackbarDisappear = (snackbarId: number) => () => {
    snackbar.remove(snackbarId);
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
