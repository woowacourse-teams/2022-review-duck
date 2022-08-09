import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useGetTemplates } from 'service/@shared/hooks/queries/template/useGet';

import { getElapsedTimeText } from 'service/@shared/utils';

import { Text } from 'common/components';

import { PAGE_LIST } from 'service/@shared/constants';

const TemplateStorePage = () => {
  const navigate = useNavigate();
  /* TODO: 라우팅으로 필터링 탭 구현 */

  const { data, isError, error } = useGetTemplates();

  const templates = data || [];

  useEffect(() => {
    if (isError) {
      alert(error?.message);
      navigate(-1);
    }
  }, [isError, error]);

  return (
    <div>
      <div>
        <Link to={PAGE_LIST.TEMPLATE_STORE}>
          <button>트랜딩</button>
        </Link>
        <Link to={`${PAGE_LIST.TEMPLATE_STORE}${PAGE_LIST.TEMPLATE_RECENT}`}>
          <button>최신</button>
        </Link>
      </div>
      <div>
        {templates.map((template) => (
          <div key={template.templateId}>
            <Text>{template.templateTitle}</Text>
            <Text>{template.templateDescription}</Text>
            <Text>{getElapsedTimeText(template.updatedAt)}</Text>
            <Text>{`${template.usedCount}회 사용됨`}</Text>
            <div
              style={{
                backgroundImage: `url(${template.creator.profileUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '30px',
                width: '30px',
              }}
            ></div>
            <Text>{`by ${template.creator.nickname}`}</Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateStorePage;
