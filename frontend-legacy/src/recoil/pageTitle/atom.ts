import { atom } from 'recoil';

import { SERVICE_NAME } from 'constant';

const pageTitleAtom = atom({ key: 'pageTitle', default: SERVICE_NAME });

export default pageTitleAtom;
