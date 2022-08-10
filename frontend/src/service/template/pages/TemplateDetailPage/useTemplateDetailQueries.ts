import { useGetTemplate } from 'service/@shared/hooks/queries/template';

function useTemplateDetailQueries(templateId: number) {
  const { data, isError, error } = useGetTemplate(templateId);

  const template = data || {
    templateId: 0,
    templateTitle: '',
    templateDescription: '',
    creator: {
      nickname: '',
      profileUrl: '',
      socialId: '',
      bio: '',
    },
    updatedAt: 0,
    usedCount: 0,
    questions: [],
  };

  return { template, isError, error };
}

export default useTemplateDetailQueries;
