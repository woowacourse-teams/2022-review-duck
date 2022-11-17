import { useState } from 'react';

import useUniqueKey from 'common/hooks/useUniqueKey';

import { getRandomNumber } from 'utils';

interface ReactionIconStack {
  id: number;
  left: `${number}%`;
  opacity: number;
}

function useIconEffectStack() {
  const getUniqueId = useUniqueKey();
  const [iconStack, setIconStack] = useState<ReactionIconStack[]>([]);

  const addIconStack = () => {
    const newIconState: ReactionIconStack = {
      id: getUniqueId(),
      left: `${getRandomNumber(-15, 15)}%`,
      opacity: getRandomNumber(3, 10) / 10,
    };

    setIconStack([...iconStack, newIconState]);
  };

  const removeIconStack = (targetId: ReactionIconStack['id']) => {
    const updateIconStack = [...iconStack];

    setIconStack(updateIconStack.filter(({ id }) => id !== targetId));
  };

  return { iconStack, addIconStack, removeIconStack };
}

export default useIconEffectStack;
