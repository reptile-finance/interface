import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import blurred from '../../Assets/Backgrounds/blurred.png';

export const SectionHeader = ({ children }: PropsWithChildren) => (
  <SectionHeaderWrapper>{children}</SectionHeaderWrapper>
);

export const SectionHeaderWrapper = styled.div`
  text-align: center;
  background: url(${blurred});
  background-repeat: no-repeat;
  background-size: cover;
  color: ${(p) => p.theme.primary};
  padding: 2rem;
  border-radius: ${(p) => p.theme.borderRadius};
  margin-bottom: 2rem;
  font-weight: 500;
  width: 100%;
`;
