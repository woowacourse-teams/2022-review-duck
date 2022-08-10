import { useGetTemplate } from 'service/@shared/hooks/queries/template';
import { useCreateForm } from 'service/@shared/hooks/queries/template/useCreate';
import { useDeleteTemplate } from 'service/@shared/hooks/queries/template/useDelete';
import { useUpdateTemplate } from 'service/@shared/hooks/queries/template/useUpdate';

function useTemplateDetailQueries(templateId: number) {
  const { data, isError, error } = useGetTemplate(templateId);

  const createFormMutation = useCreateForm();

  const updateMutation = useUpdateTemplate();

  const deleteMutation = useDeleteTemplate();

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

  return { template, isError, error, createFormMutation, updateMutation, deleteMutation };
}

export default useTemplateDetailQueries;
