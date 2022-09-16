import { PAGE_OPTION, TEMPLATE_TAB } from 'constant';
import { TemplateFilterType } from 'types';

import { useGetTemplate, useGetTemplates } from 'service/@shared/hooks/queries/template';
import { useCreateForm } from 'service/@shared/hooks/queries/template/useCreate';
import { useDeleteTemplate } from 'service/@shared/hooks/queries/template/useDelete';
import { useUpdateTemplate } from 'service/@shared/hooks/queries/template/useUpdate';

function useTemplateDetailQueries(templateId: number) {
  const { data, isError: isTemplateError, error: templateError } = useGetTemplate(templateId);
  const {
    data: templates,
    isError: isTemplatesError,
    error: templatesError,
  } = useGetTemplates(
    TEMPLATE_TAB.TREND as TemplateFilterType,
    String(1),
    PAGE_OPTION.TEMPLATE_TREND_ITEM_SIZE,
  );

  const createFormMutation = useCreateForm();

  const updateMutation = useUpdateTemplate();

  const deleteMutation = useDeleteTemplate();

  const isLoadError = isTemplateError || isTemplatesError;

  const loadError = templateError || templatesError;

  const template = data || {
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
      nickname: '',
      profileUrl: '',
      socialNickname: '',
      bio: '',
    },
    questions: [],
  };

  return {
    template,
    templates,
    isLoadError,
    loadError,
    createFormMutation,
    updateMutation,
    deleteMutation,
  };
}

export default useTemplateDetailQueries;
