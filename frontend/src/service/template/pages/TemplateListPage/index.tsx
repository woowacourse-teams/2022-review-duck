import { useEffect } from 'react';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';

import { useGetTemplates } from 'service/@shared/hooks/queries/template/useGet';

import TemplateListContainer from './TemplateListContainer';
import { PAGE_LIST } from 'service/@shared/constants';

const TemplateListPage = () => {
  const navigate = useNavigate();

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
        <Link to={PAGE_LIST.TEMPLATE_LIST}>
          <button>트랜딩</button>
        </Link>
        <Link to={`${PAGE_LIST.TEMPLATE_LIST}${PAGE_LIST.TEMPLATE_RECENT}`}>
          <button>최신</button>
        </Link>
        <Routes>
          <Route index element={<TemplateListContainer templates={templates} />} />
          <Route
            path={`${PAGE_LIST.TEMPLATE_RECENT}`}
            element={<TemplateListContainer templates={templates} />}
          />
          <Route path="*" element={<p>잘못된 접근입니다.</p>} />
        </Routes>
      </div>
    </div>
  );
};

export default TemplateListPage;
