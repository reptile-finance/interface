import styled from "styled-components";

export const Card = styled.div`
  background: ${(props) => props.theme.background3};
  border: 1px solid ${(props) => props.theme.borderColor};
  padding: 0.5rem;
  border-radius: ${(props) => props.theme.borderRadius};
`;
