import styled from "styled-components";

export const InputWrapper = styled.div`
  position: relative;
  margin: 0.25rem 0;
`;

export const StyledInput = styled.input<{ title?: string }>`
  height: 3rem;
  width: 100%;
  background: transparent;
  border: 1px solid ${(props) => props.theme.borderColor};
  border-radius: ${(props) => props.theme.borderRadius};
  color: ${(props) => props.theme.primary};
  outline: none;
  padding: 0 0.7rem;
  transition: border 0.3s ease-in-out;

  &:focus {
    border: 1px solid ${(props) => props.theme.primary};
  }

  &:hover {
    border: 1px solid ${(props) => props.theme.primary};
  }
`;

export const TitleWrapper = styled.span`
  font-size: 0.8rem;
  text-transform: lowercase;
  background: ${(props) => props.theme.background2};
  padding: 0 0.25rem;
  position: absolute;
  top: -0.65rem;
  left: 0.5rem;
`;
