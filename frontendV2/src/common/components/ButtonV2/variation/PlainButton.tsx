import { styled } from '@linaria/react';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface PlainButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: IconDefinition;
  children: string;
}

function PlainButton({ icon, children, ...args }: PlainButtonProps) {
  const childrenWithIcon = icon && (
    <>
      <FontAwesomeIcon icon={icon} />
      <span>{children}</span>
    </>
  );

  return <BasedButton {...args}>{childrenWithIcon || children}</BasedButton>;
}

const BasedButton = styled.button`
  cursor: pointer;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  font-size: 0.875rem;

  background-color: unset;
  border: none;
  outline: none;
  border-radius: unset;

  &:hover {
    text-decoration: underline;
  }
`;

export default PlainButton;
