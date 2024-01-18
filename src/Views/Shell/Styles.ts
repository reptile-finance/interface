import styled from 'styled-components';

export const ShellWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    min-width: 100vw;
    max-width: 100vw;
    min-height: 100vh;
`;

export const ShellBody = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    border: 1px solid ${(props) => props.theme.borderColor};
    position: relative;
    width: 95%;
    overflow-y: auto;
    height: 85vh;

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.xs}) {
        margin: 0;
    }
`;

export const ShellBodyContent = styled.div`
    overflow-y: scroll;
`;
