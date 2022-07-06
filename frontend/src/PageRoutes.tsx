import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReviewLayout from 'service/review/layout/ReviewLayout';
import CreateReviewPage from 'service/review/pages/CreateReviewPage';
import JoinReviewPage from 'service/review/pages/JoinReviewPage';

function PageRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ReviewLayout />}>
          <Route index element={<JoinReviewPage />} />

          <Route path="review-forms">
            <Route path="create" element={<CreateReviewPage />} />
            <Route path="join" element={<JoinReviewPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default PageRoutes;
