import { faBookmark, faHeart, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import cn from 'classnames';

import { FlexContainer } from 'common/components';

import useIconEffectStack from './useIconEffectStack';

import styles from './styles.module.scss';

export interface ReactionsContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function Container({ children }: ReactionsContainerProps) {
  return (
    <FlexContainer className={styles.componentReactions} direction="row" align="center">
      {children}
    </FlexContainer>
  );
}

interface ReactionBaseButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: IconDefinition;
  count: number;
  children: string;
}

function ReactionButton({
  className,
  icon,
  count,
  onClick,
  children,
  ...rest
}: ReactionBaseButtonProps) {
  const { iconStack, addIconStack, removeIconStack } = useIconEffectStack();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    addIconStack();

    onClick && onClick(event);
  };

  const handleIconEffectDisappear = (id: number) => () => {
    removeIconStack(id);
  };

  return (
    <div className={cn(styles.reactionButton, className)}>
      <div className={styles.effectWrapper}>
        {iconStack.map(({ id, left, opacity }) => (
          <FontAwesomeIcon
            key={id}
            className={styles.iconEffect}
            icon={icon}
            style={{ left, opacity }}
            onAnimationEnd={handleIconEffectDisappear(id)}
          />
        ))}
      </div>

      <button className={styles.button} onClick={handleClick} {...rest}>
        <FontAwesomeIcon icon={icon} />
        <span>{children}</span>
        <span className={styles.count}>{count}</span>
      </button>
    </div>
  );
}

ReactionButton.defaultProps = {
  count: 0,
};

export interface ReactionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  count?: ReactionBaseButtonProps['count'];
}

function LikeButton({ className, count, ...rest }: ReactionButtonProps) {
  return (
    <ReactionButton
      {...rest}
      className={cn(styles.likeButton, className)}
      icon={faHeart}
      count={count}
    >
      좋아요
    </ReactionButton>
  );
}

function BookmarkButton({ className, count, ...rest }: ReactionButtonProps) {
  return (
    <ReactionButton
      {...rest}
      className={cn(styles.bookmarkButton, className)}
      icon={faBookmark}
      count={count}
    >
      북마크
    </ReactionButton>
  );
}

const Reactions = Object.assign(Container, { LikeButton, BookmarkButton });

export default Reactions;
