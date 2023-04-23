import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { css } from '@linaria/core';
import { styled } from '@linaria/react';

export interface PlainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconDefinition;
  children: string;
}

function PlainButton({ icon, children, ...args }: PlainButtonProps) {
  const childrenWithIcon = icon && (
    <>
      <FontAwesomeIcon className={cssIcon} icon={icon} />
      <span>{children}</span>
    </>
  );

  return <BasedButton {...args}>{childrenWithIcon || children}</BasedButton>;
}

const cssIcon = css`
  color: blue;
`;

const BasedButton = styled.button`
  ${cssIcon} {
  }
`;

export default PlainButton;
