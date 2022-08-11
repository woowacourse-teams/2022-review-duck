import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useSnackbar from 'common/hooks/useSnackbar';

import { getElapsedTimeText } from 'service/@shared/utils';

import { Text } from 'common/components';

import useTemplateDetailQueries from './useTemplateDetailQueries';

function TemplateDetailPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();

  const { template, isError, error, createFormMutation, updateMutation, deleteMutation } =
    useTemplateDetailQueries(Number(templateId));

  useEffect(() => {
    if (isError) {
      alert(error?.message);
      navigate(-1);
    }
  }, [isError, error]);

  const handleDeleteTemplate = (templateId: number) => {
    deleteMutation.mutate(templateId, {
      onSuccess: () => {
        navigate(-1);
        showSnackbar({
          title: '템플릿이 삭제되었습니다.',
          description: '사람들과 공유할 새로운 템플릿을 만들어보세요.',
        });
      },
      onError: ({ message }) => {
        alert(message);
      },
    });
  };

  const handleEditTemplate = (templateId: number) => {
    /* TODO: reviewForm 수정 페이지로 라우팅 */
  };

  const handleCreateTemplate = (templateId: number) => {
    /* TODO: reviewForm 수정 페지이로 라우팅 */
  };

  return (
    <div>
      <button>삭제</button>
      <button>수정</button>
      <button>이 템플릿으로 회고 질문폼 생성하기</button>
      <button>이 템플릿으로 회고 바로 시작하기</button>
      <div>
        <Text>{template.templateTitle}</Text>
        <Text>{template.creator.nickname}</Text>
        <Text>{getElapsedTimeText(template.updatedAt)}</Text>
        <Text>{`${template.usedCount}회 사용됨`}</Text>
      </div>
      <div>
        {template.questions.map(({ id, value, description }, index) => (
          <div key={id}>
            <Text>{`${index + 1}. ${value}`}</Text>
            <Text>{description}</Text>
          </div>
        ))}
      </div>
      <div>
        <div
          style={{
            backgroundImage: `url(${template.creator.profileUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: '30px',
            height: '30px',
          }}
        ></div>
        <Text>{template.creator.nickname}</Text>
        <Text>{template.creator.socialId}</Text>
        <Text>{template.creator.bio}</Text>
      </div>
      <div>
        <button>깃헙프로필로 이동</button>
        <button>프로필로 이동</button>
      </div>
      <div>TOP 10 목록</div>
    </div>
  );
}

export default TemplateDetailPage;
