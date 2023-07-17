import styled from "styled-components";

export const Button = styled.button<{ disabled?: boolean }>`
  border-radius: ${(props) => props.theme.borderRadius};
  background: ${(props) => props.theme.accentBackground};
  border: 1px solid ${(props) => props.theme.accentColor};
  color: ${(props) => props.theme.accentColor};
  padding: 0.5rem 1rem;
  outline: 0;
  font-weight: ${(props) => props.theme.bolderFont};
  cursor: pointer;
  transition: scale 0.2s;
  display: flex;
  justify-content: space-around;
  align-items: center;

  ${(p) =>
    p.disabled &&
    `
    opacity: 0.5;
    cursor: inherit;
  `}

  &:hover {
    scale: 1.01;
  }
`;

export const ButtonAlt = styled(Button)`
  background: ${(props) => props.theme.accentBackground2};
  border: 1px solid ${(props) => props.theme.accentColor2};
  color: ${(props) => props.theme.accentColor2};
`;

export const ButtonDanger = styled(Button)`
  background: ${(props) => props.theme.accentBackground2};
  border: 1px solid ${(props) => props.theme.colors.red};
  color: ${(props) => props.theme.colors.red};
`;

export const FilledButton = styled.button`
  border-radius: ${(props) => props.theme.borderRadius};
  background: ${(props) => props.theme.background3};
  border: 1px solid ${(props) => props.theme.accentColor};
  color: ${(props) => props.theme.accentColor};
  padding: 0.5rem 1rem;
  font-weight: ${(props) => props.theme.bolderFont};
  cursor: pointer;
  transition: scale 0.2s;

  &:hover {
    scale: 1.01;
  }
`;
