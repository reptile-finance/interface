import styled from "styled-components";

export const SelectWrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  z-index: 1;
`;

export const SelectCurrent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 0.75rem;
  background: ${(props) => props.theme.background3};
  border-radius: ${(props) => props.theme.borderRadius};
  border: 1px solid ${(props) => props.theme.borderColor};
  cursor: pointer;
  height: 2.5rem;
  width: 100%;

  &:focus,
  &:hover,
  &.active {
    border: 1px solid ${(props) => props.theme.secondary};
  }
`;

export const SelectList = styled.div`
  position: absolute;
  top: 2.5rem;
  left: 0;
  width: 100%;
  z-index: 100;
`;

export const SelectListItem = styled(SelectCurrent)`
  border-top: 0;
  width: 100%;

  &:hover {
    background: ${(props) => props.theme.background4};
    border: 1px solid ${(props) => props.theme.borderColor};
  }
`;
