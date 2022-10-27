import React from 'react';

/**
 * 컴포넌트의 자식 요소 중 동일한 컴포넌트를 첫번째 가져옵니다.
 * @param children props로 전달된 children을 입력합니다.
 * @param targetComponent 검색할 컴포넌트를 JSX 형식으로 입력합니다.
 * @returns 검색할 컴포넌트와 동일한 컴포넌트가 있을 시, 해당하는 첫번째 컴포넌트를 반환하고 없을 시 false를 반환합니다.
 */

const getChildComponent = (children: React.ReactNode, targetComponent: JSX.Element) => {
  const target = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === targetComponent.type,
  );

  return target.length > 0 && target.splice(0, 1);
};

export default getChildComponent;
