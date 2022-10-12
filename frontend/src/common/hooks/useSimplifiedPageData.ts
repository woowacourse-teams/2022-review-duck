import { useMemo } from 'react';

/**
 * ✅ useSimplifiedPageData Hooks
 * 왜 만들게 되었는가?
 * - 리액트 쿼리의 useInfiniteQuery 사용 시 반환하는 데이터의 뎁스가 늘어나고, 늘어난 뎁스로 인해 반복문을 여러번 해주어야 해서 JSX 위치에서 2 뎁스나 늘어나게 되었다.
 * - 그렇다고 useInfiniteQuery가 나누어둔 페이지 별 데이터를 활용하는 케이스 X.
 * - Optimistic Update 시 상태 변경이 너무 지저분 해졌다 (Ex // pageIndex를 받아야하고... 해당 객체를 탐색하기 위한 key or index까지 또 받고 찾아야하고... 코드 퀄리티 👎)
 *
 * 이 Hook이 해결하는 것?
 * - useInfiniteQuery 사용으로 인해 늘어난 뎁스를 제거하여, 데이터를 조금 더 가공하기 쉽고 이쁘게 만들어준다.
 * - 반복문 안의 반복문을 방지하여, JSX 영역이 깔끔해진다.
 *
 * 변환 예시
 * - useInfiniteQuery 반환 값
 * => [
 *      {reviews: [{id: 1, content: '실제 게시글 정보'}, {id: 1, content: '실제 게시글 정보'}, {id: 1, content: '실제 게시글 정보'}, {id: 1, content: '실제 게시글 정보'}]},
 *      {reviews: [{id: 1, content: '실제 게시글 정보'}, {id: 1, content: '실제 게시글 정보'}, {id: 1, content: '실제 게시글 정보'}, {id: 1, content: '실제 게시글 정보'}]},
 *      ... 페이지가 늘어날 수록 📈
 *    ]
 *
 * - 이 Hook을 사용하면? useSimplifiedPageData(data.pages)
 * => [{id: 1, content: '실제 게시글 정보'}, {id: 1, content: '실제 게시글 정보'}, {id: 1, content: '실제 게시글 정보'}, {id: 1, content: '실제 게시글 정보'}]
 * => 👍
 *
 * 진행 상태.
 * - 리팩토링 완료 & 적용 완료
 */

function useSimplifiedPageData<PageData, ExportKey extends keyof PageData>(
  pages: PageData[],
  exportKey: ExportKey,
) {
  return useMemo(() => {
    const simplifiedPageData: any = [];

    pages.forEach((page) => {
      const targetData = page[exportKey];

      if (!Array.isArray(targetData)) {
        throw new Error('페이지 데이터가 정상적이지 않습니다.');
      }

      simplifiedPageData.push(...targetData);
    });

    return simplifiedPageData as PageData[typeof exportKey];
  }, [pages, exportKey]);
}

export default useSimplifiedPageData;
