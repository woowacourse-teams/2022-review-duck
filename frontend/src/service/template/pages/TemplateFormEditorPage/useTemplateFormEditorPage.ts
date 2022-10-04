import { UseMutationResult, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEY } from 'constant';
import {
  ErrorResponse,
  GetTemplateResponse,
  CreateTemplateRequest,
  UpdateTemplateRequest,
  CreateFormByTemplateRequest,
} from 'types';

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

  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();

  const submitMutation = templateEditMode ? createMutation : updateMutation;

  if (getTemplateQuery.isLoading || getTemplateQuery.isError) return false;

  return {
    template: getTemplateQuery.data,
    submitMutation: submitMutation as SubmitTemplateResult,
    createReviewForm: createReviewForm as SubmitReviewFormResult,
  };
}

export default useTemplateFormEditorPage;
