import { FILTER } from 'constant';

import { useGetTemplate, useGetTemplates } from 'service/@shared/hooks/queries/template';

function useTemplateDetailQueries(templateId: number) {
  const getTemplateQuery = useGetTemplate(templateId);
  const getTrendTemplateQuery = useGetTemplates({ filter: FILTER.TEMPLATE_TAB.TREND });

  const isLoading = getTrendTemplateQuery.isLoading || getTemplateQuery.isLoading;
  const isError = getTrendTemplateQuery.isError || getTemplateQuery.isError;

  if (isLoading || isError) return false;

  return {
    trendingTemplates: getTrendTemplateQuery.data.templates,
    template: getTemplateQuery.data,
  };
}

export default useTemplateDetailQueries;
