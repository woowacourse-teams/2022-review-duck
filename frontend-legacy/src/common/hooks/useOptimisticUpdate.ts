import { useEffect, useRef, useState } from 'react';

/**
 * ✅ useOptimisticUpdate Hooks
 * 왜 만들게 되었는가?
 * - 리액트 쿼리를 통한 Optimistic Update를 구현하였을 시 select 옵션은 코드 중복/뎁스 증가, 코드를 통해 의도 파악이 어려웠던 상황
 * - 반복되는 좋아요 기능 구현으로 전체적인 코드 퀄리티 👎
 * - 개선 전/후 PR 참조 :
 *
 * 이 Hook이 해결하는 것?
 * - 데이터를 찾기 위한 검색 로직과 업데이트 내용을 재사용할 수 있으며, 명시적으로 표현할 수 있다 => optimisticUpdater.basedOnKey('id', reviewId, { likes: likes + 1 });
 * - 통신에 실패하였을 시 rollback을 통해 훨씬 더 간결하게 Optimistic Update 이전의 값으로 되돌릴 수 있다.
 * - 데이터 변경 시 사용처에서 계속해서 불변성을 고려하지 않아도 된다.
 *
 * 이 Hook의 동작 방식.
 * - Hook 선언 시의 targetData 매개변수로 원본 상태를 받아 상태를 복제하며, 원본 상태를 useEffect를 통해 구독한다.
 * - optimisticUpdater를 반환하여, 해당 객체에서 제공하는 함수를 통해 데이터를 아래와 같이 변경할 수 있다.
 *   - targetData 예시 : [{id: 1, likes: 0}, {id: 2, likes: 0}, {id: 3, likes: 0}]
 *   - optimisticUpdater.basedOnKey('id', 1, { likes: 2 }); => 배열에서 id가 1에 해당하는 객체의 likes를 2로 올려라.
 *   - optimisticUpdater.basedOnIndex(1, { likes: likes + 1 }); => 배열에서 인덱스가 1번째의 객체의 likes를 2로 올려라.
 *   - optimisticUpdater.rollback() => optimistic update 이전의 원본 데이터로 복제된 상태를 다시 되돌려라.
 * - optimisticData는 복제된 상태를 반환되며, 원본 상태와 별개로 optimisticUpdater를 통해 상태를 변경할 시 optimisticData만을 변경하고 원본 상태는 원본 그대로 유지한다.
 *
 * 진행 상태.
 * - 리팩토링 완료 & 적용 완료
 */

function useOptimisticUpdate<T extends Record<string, any>>(targetData?: T[]) {
  const rollbackData = useRef<T[] | undefined>(targetData);
  const [optimisticData, setOptimisticData] = useState<T[]>([]);

  useEffect(
    function originDataUpdate() {
      if (!targetData) return;

      rollbackData.current = targetData;
      setOptimisticData([...targetData]);
    },
    [targetData],
  );

  const rollback = () => {
    if (!rollbackData.current) return;

    setOptimisticData([...rollbackData.current]);
  };

  const updateBasedOnIndex = (index: number, newValues: Partial<T>) => {
    const updateItems = [...optimisticData];

    updateItems[index] = { ...updateItems[index], ...newValues };
    setOptimisticData(updateItems);
  };

  const updateBasedKeyValue = <TargetKey extends keyof T>(
    targetKey: TargetKey,
    targetValue: T[TargetKey],
    newValues: Partial<T>,
  ) => {
    optimisticData.forEach((item, index) => {
      if (!item[targetKey] || item[targetKey] !== targetValue) {
        return;
      }

      updateBasedOnIndex(index, newValues);
    });
  };

  const optimisticUpdater = {
    rollback,
    basedOnKey: updateBasedKeyValue,
    basedOnIndex: updateBasedOnIndex,
  };

  return [optimisticData, optimisticUpdater] as const;
}

export default useOptimisticUpdate;
