import { faLock, faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { styled } from '@linaria/react';
import { FlexContainer, Text, Divider } from 'common/components';
import ButtonV2 from 'common/components/ButtonV2/ButtonV2';
import Reactions from 'components/Reactions';
import UserProfile from 'components/UserProfile';
import { PAGE_LIST } from 'constant';
import { ReviewItemDTO, UserProfileDTO } from 'models/review';
import React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import theme from 'styles/theme';
import { comparePropsWithOmit } from 'utils';

interface ReviewTemplateProps {
  id: number;
  title: string;
  contents: Array<ReviewItemDTO>;
  reviewFormCode: string;
  likes: number;
  isPrivate: boolean;
  isEditable: boolean;
  creator: UserProfileDTO;
  updatedAt: string;
  onClickDelete?: (reviewId: number) => React.MouseEventHandler;
  onClickLikes?: (reviewId: number, likes: number) => React.MouseEventHandler;
}

function ReviewTemplate({
  id,
  title,
  contents,
  reviewFormCode,
  likes,
  isPrivate,
  isEditable,
  creator,
  updatedAt,
  onClickDelete,
  onClickLikes,
}: ReviewTemplateProps): JSX.Element {
  const editUrl = `${PAGE_LIST.REVIEW}/${reviewFormCode}/${id}?redirect=${encodeURIComponent(PAGE_LIST.TIMELINE)}`;

  return (
    <Container gap="large">
      <UserProfile
        socialId={creator.id}
        image={creator.profileUrl}
        nickname={creator.nickname}
        description={updatedAt}
      />

      {isEditable && (
        <OptionWrapper direction="row" justify="right" gap="large">
          <Link to={editUrl}>
            <OptionButton icon={faPenToSquare}>편집</OptionButton>
          </Link>
          <OptionButton icon={faTrash} onClick={onClickDelete?.(id)}>
            삭제
          </OptionButton>
        </OptionWrapper>
      )}

      <FlexContainer gap="large">
        <Title as="h4">
          {title}{' '}
          {isPrivate && (
            <PrivateBadge direction="row" align="center">
              <FontAwesomeIcon icon={faLock} />
              <Text size={12}>비공개</Text>
            </PrivateBadge>
          )}
        </Title>

        {contents.map(({ question, answer }, index) => {
          const numbering = index + 1;

          return (
            <Fragment key={question.id}>
              <ReviewItemWrapper gap="medium">
                <Question as="h5">
                  {numbering}. {question.value}
                </Question>
                <Answer>{answer.value}</Answer>
              </ReviewItemWrapper>

              {contents.length > numbering && <Divider />}
            </Fragment>
          );
        })}
      </FlexContainer>

      <Reactions>
        <Reactions.LikeButton count={likes} onClick={onClickLikes?.(id, likes)} />
      </Reactions>
    </Container>
  );
}

export default React.memo(ReviewTemplate, comparePropsWithOmit(['onClickDelete', 'onClickLikes']));

const Container = styled(FlexContainer)`
  position: relative;

  background-color: ${theme.color.white[900]};
  box-shadow: 0 8px 8px 8px ${theme.color.black[20]};
  padding: 1.5rem;
  border-radius: 1rem;
`;

const OptionWrapper = styled(FlexContainer)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;

  width: 30%;
`;

const Title = styled(Text)`
  font-weight: bold;
  color: ${theme.color.deepGreen['600']};
  border-bottom: 1px solid ${theme.color.deepGreen['100']};
  padding: 0 0 1rem;

  display: flex;
  align-items: center;
`;

const PrivateBadge = styled(FlexContainer)`
  font-size: 0.75rem;
  margin-left: 0.75rem;
  gap: 0.25rem;
  color: #fff;
  background-color: #317172;
  border-radius: 6px;
  padding: 0.25rem 0.4rem;
`;

const OptionButton = styled(ButtonV2)`
  color: ${theme.color.gray['700']};
  background-color: unset;
`;

const ReviewItemWrapper = styled(FlexContainer)`
  &:last-child {
    border-bottom: none;
    padding: 0;
  }
`;

const Question = styled(Text)`
  color: ${theme.color.deepGreen[700]};
`;

const Answer = styled(Text)`
  word-break: break-word;
  white-space: pre-line;
  line-height: 180%;
  color: ${theme.color.black[800]};
`;
