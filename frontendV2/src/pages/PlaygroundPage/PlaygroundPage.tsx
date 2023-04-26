import LayoutContainer from 'components/LayoutContainer';
import UserProfile from 'components/UserProfile';
import { ReviewTimelineContainer } from 'containers';
import ReviewTemplate from 'templates/ReviewTemplate/ReviewTemplate';

function PlaygroundPage() {
  return (
    <LayoutContainer>
      <ReviewTimelineContainer />
    </LayoutContainer>
  );
}

export default PlaygroundPage;
