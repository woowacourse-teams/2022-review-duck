import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import cn from 'classnames';

import { TemplateFilterType } from 'service/@shared/types';

import { useGetTemplates } from 'service/@shared/hooks/queries/template/useGet';

import Icon from 'common/components/Icon';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

import styles from './styles.module.scss';

import TemplateListContainer from './TemplateListContainer';
import { PAGE_LIST, TEMPLATE_TAB } from 'service/@shared/constants';

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
        <Link to={`${PAGE_LIST.TEMPLATE_LIST}?filter=${TEMPLATE_TAB.TREND}`}>
          <button
            className={cn(styles.button, { [styles.focus]: currentTab === TEMPLATE_TAB.TREND })}
          >
            <div className={styles.buttonBox}>
              <Icon className={styles.icon} code="local_fire_department" />
              트랜딩
            </div>
          </button>
        </Link>
        <Link to={`${PAGE_LIST.TEMPLATE_LIST}?filter=${TEMPLATE_TAB.LATEST}`}>
          <button
            className={cn(styles.button, { [styles.focus]: currentTab === TEMPLATE_TAB.LATEST })}
          >
            <div className={styles.buttonBox}>
              <Icon className={styles.icon} code="playlist_add_check_circle" />
              최신
            </div>
          </button>
        </Link>
        <TemplateListContainer templates={templates} />
      </div>
    </LayoutContainer>
  );
}

export default TemplateListPage;
