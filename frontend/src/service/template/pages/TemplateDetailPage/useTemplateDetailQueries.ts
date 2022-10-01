import { PAGE_OPTION, FILTER } from 'constant';
import { TemplateFilterType } from 'types';

import { useGetTemplate, useGetTemplates } from 'service/@shared/hooks/queries/template';
import { useCreateForm } from 'service/@shared/hooks/queries/template/useCreate';
import { useDeleteTemplate } from 'service/@shared/hooks/queries/template/useDelete';
import { useUpdateTemplate } from 'service/@shared/hooks/queries/template/useUpdate';

function useTemplateDetailQueries(templateId: number) {
  const getTemplateQuery = useGetTemplate(templateId);
  const getTrendTemplateQuery = useGetTemplates(
    FILTER.TEMPLATE_TAB.TREND as TemplateFilterType,
    String(1),
    PAGE_OPTION.TEMPLATE_TREND_ITEM_SIZE,
  );

  const createFormMutation = useCreateForm();

  const updateMutation = useUpdateTemplate();
  const deleteMutation = useDeleteTemplate();

  const isLoading = getTrendTemplateQuery.isLoading || getTemplateQuery.isLoading;
  const isError = getTrendTemplateQuery.isError || getTemplateQuery.isError;

  if (isLoading || isError) return false;

  return {
    trendingTemplates: getTrendTemplateQuery.data.templates,
    template: getTemplateQuery.data,
    createFormMutation,
    updateMutation,
    deleteMutation,
  };
}

export default useTemplateDetailQueries;
