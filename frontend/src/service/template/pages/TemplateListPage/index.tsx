import { Link, useSearchParams } from 'react-router-dom';

import { faArrowUp, faBarsStaggered, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';
import { PAGE_LIST, TEMPLATE_TAB } from 'constant';
import { TemplateFilterType } from 'types';

import { useGetTemplates } from 'service/@shared/hooks/queries/template/useGet';

import { Button, FlexContainer } from 'common/components';

import LayoutContainer from 'service/@shared/components/LayoutContainer';

import styles from './styles.module.scss';

import TemplateListContainer from './TemplateListContainer';

function TemplateListPage() {
  const [searchParam] = useSearchParams();

  const currentTab = searchParam.get('filter') || 'trend';
  const pageNumber = searchParam.get('page') || String(1);

  const initialTemplates = {
    numberOfTemplates: 0,
    templates: [],
  };
  const { data } = useGetTemplates(currentTab as TemplateFilterType, pageNumber);

  const { numberOfTemplates, templates } = data || initialTemplates;

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
                <FontAwesomeIcon className={styles.icon} icon={faArrowUp} />
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
                <FontAwesomeIcon className={styles.icon} icon={faBarsStaggered} />
                최신
              </div>
            </button>
          </Link>
        </FlexContainer>
        <div className={styles.buttonContainer}>
          <Link to={PAGE_LIST.TEMPLATE_FORM}>
            <Button>
              <FontAwesomeIcon icon={faPenToSquare} />
              템플릿 만들기
            </Button>
          </Link>
        </div>
      </FlexContainer>
      <TemplateListContainer
        templates={templates}
        numberOfTemplates={numberOfTemplates}
        currentTab={currentTab as TemplateFilterType}
        pageNumber={pageNumber}
      />
    </LayoutContainer>
  );
}

export default TemplateListPage;
