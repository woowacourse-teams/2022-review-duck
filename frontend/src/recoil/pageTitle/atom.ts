import { SERVICE_NAME } from 'constant';
import { atom } from 'recoil';

const pageTitleAtom = atom({ key: 'pageTitle', default: SERVICE_NAME });

export default pageTitleAtom;
