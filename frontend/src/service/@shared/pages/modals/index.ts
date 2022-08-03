/* eslint-disable */
import useOriginModal from 'common/hooks/useModal';
import ModalStartReview from './ModalStartReview';

const modalContentList = { ModalStartReview } as const;

type ModalKeyList = keyof typeof modalContentList;

export const useModal = useOriginModal<ModalKeyList>;

export default modalContentList;
