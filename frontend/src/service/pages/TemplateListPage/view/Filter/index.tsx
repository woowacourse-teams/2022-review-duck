import {
  faPenToSquare,
  faSquarePollHorizontal,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { TemplateFilterType } from 'service/types';

import { Button, FlexContainer } from 'common/components';

import styles from './styles.module.scss';

interface ContainerProps {
  children: React.ReactNode;
}

function Container({ children }: ContainerProps) {
  return (
    <FlexContainer
      className={styles.componentPageFilter}
      direction="row"
      align="center"
      justify="space-between"
    >
      {children}
    </FlexContainer>
  );
}

interface SortListProps {
  focusedOption: TemplateFilterType;
  sortOptions: Array<{
    icon: IconDefinition;
    name: string;
    query: TemplateFilterType;
  }>;
  onClickSortButton: (query: TemplateFilterType) => React.MouseEventHandler;
}

function SortList({ focusedOption, sortOptions, onClickSortButton }: SortListProps) {
  return (
    <FlexContainer className={styles.sortListButtons} direction="row" gap="large" align="center">
      {sortOptions.map(({ icon, name, query }) => (
        <button
          key={query}
          className={cn(styles.button, { [styles.focus]: focusedOption === query })}
          type="button"
          onClick={onClickSortButton(query)}
        >
          <FontAwesomeIcon className={styles.icon} icon={icon} />
          <span className={styles.text}>{name}</span>
        </button>
      ))}
    </FlexContainer>
  );
}

interface MoreButtonsProps {
  onClickCreate: React.MouseEventHandler<HTMLButtonElement>;
}

function MoreButtons({ onClickCreate }: MoreButtonsProps) {
  return (
    <FlexContainer>
      <Button type="button" onClick={onClickCreate}>
        <FontAwesomeIcon icon={faPenToSquare} />
        <span>템플릿 만들기</span>
      </Button>
    </FlexContainer>
  );
}

interface SearchResultProps {
  search: string;
}

function SearchResult({ search }: SearchResultProps) {
  return (
    <FlexContainer className={styles.searchResult} direction="row" gap="medium">
      <FontAwesomeIcon className={styles.icon} icon={faSquarePollHorizontal} />
      <span className={styles.resultText}>
        &apos;<span className={styles.searchText}>{search}</span>&apos; 검색 결과
      </span>
    </FlexContainer>
  );
}

const Filter = Object.assign(Container, {
  SortList,
  MoreButtons,
  SearchResult,
});

export default Filter;
