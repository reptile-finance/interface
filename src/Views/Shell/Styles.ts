import styled from 'styled-components';

export const ShellWrapper = styled.div`
    display: flex;
    justify-content: space-between;
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
    background: ${(props) => props.theme.background2};
    margin: 0.5rem 0.5rem 0 1rem;
    position: relative;
    width: 100%;
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

    // mini logo
    > img {
        display: none;
    }

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.xs}) {
        .current-path {
            display: none;
        }

        > img {
            width: 2rem;
            height: auto;
            display: inline-block;
        }
    }
`;

export const ShellBodyContent = styled.div`
    overflow-y: scroll;
`;

export const AccountWrapper = styled.div`
    display: flex;
    align-items: center;
`;

export const AccountBalance = styled.span`
    margin-right: 1rem;
    padding: 0.5rem 0.75rem;
    background: ${(props) => props.theme.background3};
    border-radius: ${(props) => props.theme.borderRadius};
    font-weight: ${(props) => props.theme.bolderFont};
    cursor: pointer;
    color: #fff;

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.xs}) {
        display: none;
    }
`;
