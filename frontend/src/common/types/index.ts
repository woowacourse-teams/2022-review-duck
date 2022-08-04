import { SnackbarProps } from 'common/components/Snackbar';

interface snackbarStackAtom extends SnackbarProps {
  key: number;
}

export interface SnackbarAtom {
  uniqueKey: number;
  stack: snackbarStackAtom[];
}
