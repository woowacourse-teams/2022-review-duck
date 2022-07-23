import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { PAGE_LIST } from 'service/@shared/constants';
import ReviewLayout from 'service/review/layout/ReviewLayout';
import CreateReviewFormPage from 'service/review/pages/CreateReviewFormPage';
import JoinReviewPage from 'service/review/pages/JoinReviewPage';
import MainPage from 'service/review/pages/MainPage';
import Playground from 'service/review/pages/Playground';
import ReviewListPage from 'service/review/pages/ReviewListPage';
import SubmitReviewPage from 'service/review/pages/SubmitReviewPage';

function PageRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ReviewLayout />}>
          <Route index element={<MainPage />} />

          <Route>
            <Route path={PAGE_LIST.REVIEW_FORM} element={<CreateReviewFormPage />}>
              <Route path={':reviewFormCode'} />
            </Route>
          </Route>

          <Route>
            <Route path={PAGE_LIST.REVIEW_JOIN} element={<JoinReviewPage />} />
            <Route path={PAGE_LIST.REVIEW} element={<SubmitReviewPage />}>
              <Route path=":reviewFormCode" />
            </Route>
          </Route>
        </Route>

        <Route path={PAGE_LIST.REVIEW_ANSWER_LIST} element={<ReviewListPage />}>
          <Route path=":reviewFormCode" />
        </Route>

        <Route path="playground" element={<Playground />} />
      </Routes>
    </BrowserRouter>
  );
}

export default PageRoutes;
