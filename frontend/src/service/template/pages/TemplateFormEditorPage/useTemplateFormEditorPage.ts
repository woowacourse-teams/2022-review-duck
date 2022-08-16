import { UseMutationResult, useQueryClient } from 'react-query';

import { ErrorResponse, GetTemplateResponse, CreateReviewFormRequest } from 'service/@shared/types';

import { useCreateReviewForm } from 'service/@shared/hooks/queries/review';
import { useGetTemplate } from 'service/@shared/hooks/queries/template';

import { QUERY_KEY } from 'service/@shared/constants';

type SubmitMutationResult = UseMutationResult<
  { reviewFormCode: string },
  ErrorResponse,
  CreateReviewFormRequest
>;

function useTemplateFormEditorPage(templateId: string) {
  const getTemplateQuery = useGetTemplate(Number(templateId));

  const queryClient = useQueryClient();

  const submitMutation = useCreateReviewForm({
    onSuccess: () => {
      queryClient.invalidateQueries([
        QUERY_KEY.DATA.TEMPLATE,
        QUERY_KEY.API.GET_TEMPLATE,
        { templateId: Number(templateId) },
      ]);
    },
  });

  const initialTemplateFormContents: GetTemplateResponse = {
    info: {
      id: 0,
      title: '',
      description: '',
      updatedAt: 0,
      usedCount: 0,
    },
    creator: {
      id: 0,
      socialNickname: '',
      nickname: '',
      profileUrl: '',
    },
    questions: [],
  };

  const template = getTemplateQuery.data || initialTemplateFormContents;

  return {
    template,
    isLoadError: getTemplateQuery.isError,
    loadError: getTemplateQuery.error,
    isSubmitLoading: submitMutation.isLoading,
    submitReviewForm: submitMutation as SubmitMutationResult,
  };
}

export default useTemplateFormEditorPage;
