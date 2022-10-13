import { GetTemplatesResponse, TemplateFilterType } from 'types';

import { useGetSearchTemplates, useGetTemplates } from 'service/@shared/hooks/queries/template';

const initialTemplates: GetTemplatesResponse = {
  numberOfTemplates: 0,
  templates: [
    {
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
        profileUrl: 'https://',
        socialNickname: '',
      },
    },
  ],
};

function useTemplateList(filter: TemplateFilterType, pageNumber: number, search: string) {
  const getTemplates = useGetTemplates(
    {
      filter,
      pageNumber,
    },
    {
      enabled: !search,
    },
  );

  const getSearchTemplates = useGetSearchTemplates(
    {
      search,
      pageNumber,
    },
    {
      enabled: !!search,
    },
  );

  return getSearchTemplates.data || getTemplates.data || initialTemplates;
}

export default useTemplateList;
