import { snackbarStackWithActive } from 'common/recoil/snackbar';

import { useRecoilValue } from 'recoil';

import useSnackbar from 'common/hooks/useSnackbar';

import SnackbarComponent from 'common/components/Snackbar/component';

function SnackbarProvider() {
  const snackbarActivityStack = useRecoilValue(snackbarStackWithActive);
  const snackbar = useSnackbar();

  const handleRemoveSnackbar = (snackbarId: number) => () => {
    snackbar.remove(snackbarId);
  };

  return (
    <div id="snackbar-container">
      {snackbarActivityStack.map(({ key, ...rest }) => (
        <Snackbar key={key} {...rest} onDisappear={handleRemoveSnackbar(key)} />
      ))}
    </div>
  );
}

const Snackbar = Object.assign(SnackbarComponent, {
  Provider: SnackbarProvider,
});

export default Snackbar;
