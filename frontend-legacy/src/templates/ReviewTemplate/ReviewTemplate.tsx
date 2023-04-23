import { styled } from '@linaria/react';
import { FlexContainer, Text, Divider } from 'common/components';
import Reactions from 'components/Reactions';
import UserProfile from 'components/UserProfile';
import { ReviewItemDTO, UserProfileDTO } from 'models/review';
import { Fragment } from 'react';
import theme from 'styles/theme';

interface ReviewTemplateProps {
  id: number;
  title: string;
  contents: Array<ReviewItemDTO>;
  likes: number;
  isPrivate: boolean;
  isEditable: boolean;
  creator: UserProfileDTO;
  updatedAt: string;
}

function ReviewTemplate({
  id,
  title,
  contents,
  likes,
  isPrivate,
  isEditable,
  creator,
  updatedAt,
}: ReviewTemplateProps): JSX.Element {
  return (
    <Container gap="large">
      <UserProfile
        socialId={creator.id}
        image={creator.profileUrl}
        nickname={creator.nickname}
        description={updatedAt}
      />

      <FlexContainer gap="large">
        <Title as="h4">{title}</Title>

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
        <Reactions.LikeButton count={likes} />
      </Reactions>
    </Container>
  );
}

const Container = styled(FlexContainer)`
  background-color: ${theme.color.white[900]};
  box-shadow: 0 8px 8px 8px ${theme.color.black[20]};
  padding: 1.5rem;
  border-radius: 1rem;
`;

const Title = styled(Text)`
  font-weight: bold;
  color: ${theme.color.deepGreen['600']};
  border-bottom: 1px solid ${theme.color.deepGreen['100']};
  padding: 0 0 1rem;
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
  color: ${theme.color.black[800]};
`;

export default ReviewTemplate;
