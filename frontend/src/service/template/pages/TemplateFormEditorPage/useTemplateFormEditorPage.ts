import { UseMutationResult, useQueryClient } from 'react-query';

import { QUERY_KEY } from 'constant';

import {
  ErrorResponse,
  GetTemplateResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  CreateFormByTemplateRequest,
} from 'service/@shared/types';

import { useCreateFormByTemplate } from 'service/@shared/hooks/queries/review';
import { useGetTemplate } from 'service/@shared/hooks/queries/template';
import { useCreateTemplate } from 'service/@shared/hooks/queries/template/useCreate';
import { useUpdateTemplate } from 'service/@shared/hooks/queries/template/useUpdate';

type SubmitReviewFormResult = UseMutationResult<
  { reviewFormCode: string },
  ErrorResponse,
  CreateFormByTemplateRequest
>;

type SubmitTemplateResult = UseMutationResult<
  { templateId: number },
  ErrorResponse,
  CreateTemplateRequest | UpdateTemplateRequest
>;

function useTemplateFormEditorPage(templateId: string, templateEditMode: string) {
  const getTemplateQuery = useGetTemplate(Number(templateId), {
    enabled: !!templateId,
  });

  const queryClient = useQueryClient();

  const createReviewForm = useCreateFormByTemplate({
    onSuccess: () => {
      queryClient.invalidateQueries([
        QUERY_KEY.DATA.TEMPLATE,
        QUERY_KEY.API.GET_TEMPLATE,
        { templateId: Number(templateId) },
      ]);
    },
  });

  const createTemplate = useCreateTemplate();

  const updateTemplate = useUpdateTemplate();

  const templateMutation = templateEditMode ? updateTemplate : createTemplate;

  const initialTemplateFormContents: GetTemplateResponse = {
    isCreator: false,
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
    questions: [
      {
        value: '',
        description: '',
      },
    ],
  };

  const template = getTemplateQuery.data || initialTemplateFormContents;

  return {
    template,
    isLoadError: getTemplateQuery.isError,
    loadError: getTemplateQuery.error,
    isSubmitLoading: createReviewForm.isLoading || templateMutation.isLoading,
    templateMutation: templateMutation as SubmitTemplateResult,
    createReviewForm: createReviewForm as SubmitReviewFormResult,
  };
}

export default useTemplateFormEditorPage;
