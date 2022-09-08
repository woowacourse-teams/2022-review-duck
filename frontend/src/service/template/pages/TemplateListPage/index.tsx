import { useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import cn from 'classnames';
import { PAGE_LIST, TEMPLATE_TAB } from 'constant';
import { TemplateFilterType } from 'types';

import { useGetTemplates } from 'service/@shared/hooks/queries/template/useGet';

import { Button, FlexContainer } from 'common/components';

import Icon from 'common/components/Icon';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

import styles from './styles.module.scss';

import TemplateListContainer from './TemplateListContainer';

function TemplateListPage() {
  const [searchParam] = useSearchParams();

  const tabString = searchParam.get('filter');
  const currentTab = tabString === 'trend' || tabString === 'latest' ? tabString : 'trend';

  const { data } = useGetTemplates(currentTab as TemplateFilterType);

  const { templates } = data || { templates: [] };

  return (
    <LayoutContainer>
      <FlexContainer className={styles.header} direction="row" justify="space-between">
        <FlexContainer direction="row">
          <Link to={`${PAGE_LIST.TEMPLATE_LIST}?filter=${TEMPLATE_TAB.TREND}`}>
            <button className={styles.button}>
              <div
                className={cn(styles.buttonBox, {
                  [styles.focus]: currentTab === TEMPLATE_TAB.TREND,
                })}
              >
                <Icon className={styles.icon} code="local_fire_department" />
                트랜딩
              </div>
            </button>
          </Link>
          <Link to={`${PAGE_LIST.TEMPLATE_LIST}?filter=${TEMPLATE_TAB.LATEST}`}>
            <button className={styles.button}>
              <div
                className={cn(styles.buttonBox, {
                  [styles.focus]: currentTab === TEMPLATE_TAB.LATEST,
                })}
              >
                <Icon className={styles.icon} code="playlist_add_check_circle" />
                최신
              </div>
            </button>
          </Link>
        </FlexContainer>
        <div className={styles.buttonContainer}>
          <Link to={PAGE_LIST.TEMPLATE_FORM}>
            <Button>
              <Icon code="rate_review" />
              템플릿 만들기
            </Button>
          </Link>
        </div>
      </FlexContainer>
      <TemplateListContainer templates={templates} />
    </LayoutContainer>
  );
}

export default TemplateListPage;
