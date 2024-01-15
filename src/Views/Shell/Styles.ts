import styled from 'styled-components';

export const ShellWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 100vw;
    max-width: 100vw;
    min-height: 100vh;
`;

export const ShellBody = styled.div`
    display: flex;
    flex-direction: column;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    border-style: solid;
    border-right: 1px solid;
    border-left: 1px solid;
    border-top: 1px solid;
    border-bottom: 0;
    border-color: ${(props) => props.theme.borderColor};
    position: relative;
    width: 95%;
    max-width: 100%;
    min-height: 100vh;

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.xs}) {
        margin: 0;
    }
`;

export const ShellBodyHeader = styled.div`
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    padding: 1rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .current-path {
        text-transform: capitalize;
    }
`;

export const ShellBodyContent = styled.div`
    overflow-y: scroll;
`;

export const AccountWrapper = styled.div`
    display: none;
    align-items: center;
    flex: 0 0 auto;
    @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
        display: flex;
    }
`;
