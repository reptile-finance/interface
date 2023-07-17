import styled from "styled-components";

export const RowFlex = styled.div<{
  alignItems: string;
  justifyContent: string;
  gap: string;
}>`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  gap: ${(props) => props.gap};
  flex-direction: row;
`;

export const ColumnFlex = styled.div<{
  alignItems: string;
  justifyContent: string;
  gap: string;
}>`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  gap: ${(props) => props.gap};
  flex-direction: column;
`;
