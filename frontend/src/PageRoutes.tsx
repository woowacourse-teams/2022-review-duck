import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { PAGE_LIST } from 'service/@shared/constants';
import ReviewLayout from 'service/review/layout/ReviewLayout';
import MainPage from 'service/review/pages/MainPage';
import Playground from 'service/review/pages/Playground';
import ReviewFormPage from 'service/review/pages/ReviewFormPage';
import ReviewJoinPage from 'service/review/pages/ReviewJoinPage';
import ReviewOverviewPage from 'service/review/pages/ReviewOverviewPage';
import ReviewPage from 'service/review/pages/ReviewPage';

function PageRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ReviewLayout />}>
          <Route index element={<MainPage />} />

          <Route path={PAGE_LIST.REVIEW_FORM} element={<ReviewFormPage />}>
            <Route path={':reviewFormCode'} element={<ReviewFormPage />} />
          </Route>

          <Route>
            <Route path={PAGE_LIST.REVIEW_JOIN} element={<ReviewJoinPage />} />
            <Route path={PAGE_LIST.REVIEW}>
              <Route index element={<ReviewPage />} />
              <Route path=":reviewFormCode" element={<ReviewPage />} />
            </Route>
          </Route>
        </Route>

        <Route path={PAGE_LIST.REVIEW_OVERVIEW}>
          <Route index element={<ReviewOverviewPage />} />
          <Route path=":reviewFormCode" element={<ReviewOverviewPage />} />
        </Route>

        <Route path="playground" element={<Playground />} />
      </Routes>
    </BrowserRouter>
  );
}

export default PageRoutes;
