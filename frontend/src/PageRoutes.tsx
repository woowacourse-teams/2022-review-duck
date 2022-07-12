import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ReviewLayout from 'service/review/layout/ReviewLayout';
import CreateReviewFormPage from 'service/review/pages/CreateReviewFormPage';
import JoinReviewPage from 'service/review/pages/JoinReviewPage';
import MainPage from 'service/review/pages/MainPage';
import SubmitReviewPage from 'service/review/pages/SubmitReviewPage';

function PageRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ReviewLayout />}>
          <Route index element={<MainPage />} />

          <Route path="review-forms">
            <Route path="join" element={<JoinReviewPage />} />
            <Route path="create" element={<CreateReviewFormPage />} />
            <Route path="submit" element={<SubmitReviewPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default PageRoutes;
