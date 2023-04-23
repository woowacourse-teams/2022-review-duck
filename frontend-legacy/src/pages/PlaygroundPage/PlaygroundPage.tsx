import LayoutContainer from 'components/LayoutContainer';
import UserProfile from 'components/UserProfile';
import ReviewTemplate from 'templates/ReviewTemplate/ReviewTemplate';

function PlaygroundPage() {
  return (
    <LayoutContainer>
      <UserProfile socialId={1} nickname="콤피" description="추가 설명" />

      <hr />

      <ReviewTemplate
        id={1}
        title="하이하이"
        contents={[
          {
            question: {
              id: 1,
              value: '하하',
              description: '테스트',
            },
            answer: {
              id: 1,
              value: '답변',
            },
          },
          {
            question: {
              id: 2,
              value: '하하 2',
              description: '테스트',
            },
            answer: {
              id: 2,
              value: '답변',
            },
          },
        ]}
        likes={10}
        isEditable={true}
        updatedAt="5분 전"
        creator={{
          id: 5,
          nickname: '닉네임',
          profileUrl: 'https://avatars.githubusercontent.com/u/94832610?v=4',
          socialNickname: 'compy-ryu',
        }}
      />
    </LayoutContainer>
  );
}

export default PlaygroundPage;
