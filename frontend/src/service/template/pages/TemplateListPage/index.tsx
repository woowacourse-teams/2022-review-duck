import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { TemplateFilterType } from 'service/@shared/types';

import { useGetTemplates } from 'service/@shared/hooks/queries/template/useGet';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

import TemplateListContainer from './TemplateListContainer';
import { PAGE_LIST } from 'service/@shared/constants';

function TemplateListPage() {
  const navigate = useNavigate();
  const [searchParam] = useSearchParams();

  const currentTab = searchParam.get('filter') as TemplateFilterType;

  const { data, isError, error } = useGetTemplates(currentTab);

  const { templates } = data || { templates: [] };

  useEffect(() => {
    if (isError) {
      alert(error?.message);
      navigate(-1);
    }
  }, [isError, error]);

  return (
    <LayoutContainer>
      <div>
        <Link to={`${PAGE_LIST.TEMPLATE_LIST}?filter=trend`}>
          <button>트랜딩</button>
        </Link>
        <Link to={`${PAGE_LIST.TEMPLATE_LIST}?filter=latest`}>
          <button>최신</button>
        </Link>
        <TemplateListContainer templates={templates} />
      </div>
    </LayoutContainer>
  );
}

export default TemplateListPage;
