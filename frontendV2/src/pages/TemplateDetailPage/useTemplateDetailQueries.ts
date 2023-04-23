import { useEffect } from 'react';

import { useGetTemplate, useGetTemplates } from 'hooks/queries/template';

import usePageTitle from 'common/hooks/usePageTitle';

import { FILTER, SERVICE_NAME } from 'constant';

function useTemplateDetailQueries(templateId: number) {
  const getTemplateQuery = useGetTemplate(templateId);
  const pageTitle = usePageTitle(null, SERVICE_NAME);
  const getTrendTemplateQuery = useGetTemplates({ filter: FILTER.TEMPLATE_TAB.TREND });

  const isLoading = getTrendTemplateQuery.isLoading || getTemplateQuery.isLoading;
  const isError = getTrendTemplateQuery.isError || getTemplateQuery.isError;

  useEffect(
    function changePageTitleToTemplateName() {
      if (!getTemplateQuery.data) return;

      pageTitle.set(getTemplateQuery.data.info.title);
    },
    [getTemplateQuery.isSuccess],
  );

  if (isLoading || isError) return false;

  return {
    trendingTemplates: getTrendTemplateQuery.data.templates,
    template: getTemplateQuery.data,
  };
}

export default useTemplateDetailQueries;
