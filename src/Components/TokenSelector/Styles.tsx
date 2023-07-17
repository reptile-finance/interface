import styled from 'styled-components';

export const ActionWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;

    * {
        margin-left: 0.5rem;
    }
`;

export const TokenList = styled.div`
    display: flex;
    flex-direction: column;
    background: ${(props) => props.theme.background4};
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
`;

export const TokenListItem = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.8rem;
    height: 50px;
    padding: 0.5em 1em;
    border-radius: ${(props) => props.theme.borderRadius};

    &:hover {
        cursor: pointer;
        background-color: ${(props) => props.theme.background2};
    }
`;

export const Icon = styled.img`
    height: 2rem;
    aspect-ratio: 1;
`;

export const TokenInfo = styled.span`
    display: flex;
    align-items: center;
`;

export const TokenNameColumn = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 0.5em;
`;

export const TokenName = styled.span`
    font-weight: ${(props) => props.theme.bolderFont};
`;

export const TokenSearchWrapper = styled.div`
    background: ${(props) => props.theme.background2};
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    margin-bottom: 0.5rem;
    transition: border 0.2s ease-in-out;
    height: 2.5rem;
    padding: 0.25rem 0.5rem;

    &:hover,
    &:focus-within {
        cursor: pointer;
        border: 1px solid ${(props) => props.theme.accentColor};
    }

    > input {
        width: 100%;
        color: ${(props) => props.theme.primary};
        background: transparent;
        height: 100%;
        border: 0;
        outline: 0;
    }
`;
