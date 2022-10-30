import { SnackbarProps } from 'common/components/Snackbar/component';

interface snackbarStackAtom extends SnackbarProps {
  key: number;
}

export interface SnackbarAtom {
  uniqueKey: number;
  stack: snackbarStackAtom[];
}
