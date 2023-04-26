import { useEffect, useRef, useState } from 'react';

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
