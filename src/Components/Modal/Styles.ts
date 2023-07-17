import styled from "styled-components";
import Bg3 from "../../Assets/Backgrounds/bg3.png";

export const RewardsModalTitle = styled.div`
  padding: 1rem;
  font-size: 1.5rem;
  background: url(${Bg3});
  font-weight: ${(props) => props.theme.bolderFont};
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

export const RewardsModalContent = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

export const RewardsModalActions = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: flex-end;
`;
