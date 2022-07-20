import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ReviewLayout from 'service/review/layout/ReviewLayout';
import CreateReviewFormPage from 'service/review/pages/CreateReviewFormPage';
import JoinReviewPage from 'service/review/pages/JoinReviewPage';
import MainPage from 'service/review/pages/MainPage';
import ReviewListPage from 'service/review/pages/ReviewListPage';
import SubmitReviewPage from 'service/review/pages/SubmitReviewPage';

function PageRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ReviewLayout />}>
          <Route index element={<MainPage />} />

          <Route path="review-forms">
            <Route index element={<CreateReviewFormPage />} />
            <Route path=":reviewFormCode" element={<CreateReviewFormPage />} />
          </Route>

          <Route path="review">
            <Route index element={<SubmitReviewPage />} />
            <Route path="join" element={<JoinReviewPage />} />
            <Route path="submit/:reviewFormCode" element={<SubmitReviewPage />} />
          </Route>
        </Route>

        <Route path="overview/:reviewFormCode" element={<ReviewListPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default PageRoutes;
