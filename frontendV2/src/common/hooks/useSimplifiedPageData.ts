import { useMemo } from 'react';

function useSimplifiedPageData<PageData, ExportKey extends keyof PageData>(
  pages: PageData[] = [],
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
