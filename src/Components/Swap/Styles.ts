import styled, { css, keyframes } from 'styled-components';
import { Button } from '../Button';

const spinAnimation = keyframes`
    from {  
        transform:rotate(0deg);
    }
    to {
        transform:rotate(360deg);
    }
`;

export const SwapWrapper = styled.div`
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    width: 100%;
    max-width: 50rem;

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
        width: 100%;
        max-width: 100%;
    }
`;

const swapPadding = css`
    padding: ${(props) => props.theme.boxPadding};
`;

export const SwapActionButtonWrapper = styled.div`
    ${swapPadding}
`;

export const SwapActionButton = styled(Button)`
    width: 100%;
    padding: 0.75rem;
`;

export const SwapHeader = styled.div`
    display: flex;
    align-items: baseline;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    ${swapPadding}

    .swap {
        font-weight: ${(props) => props.theme.bolderFont};
        color: ${(props) => props.theme.accentColor};
    }
`;

export const SwapInputBox = styled.div`
    display: flex;
    flex-direction: column;
    ${swapPadding}
`;

export const SwapInputTokenBalances = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;

    span:first-child {
        font-weight: ${(props) => props.theme.bolderFont};
    }
`;

export const SwapBoxToken = styled.span`
    padding: 0.15rem 0.5rem;
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    background: ${(props) => props.theme.background3};
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: border 0.2s ease-in-out;

    img {
        margin-right: 0.5rem;
        width: 1.25rem;
    }

    &:hover {
        border: 1px solid ${(props) => props.theme.accentColor};
    }
`;

export const SwapInputNumber = styled.div`
    margin-top: 0.5rem;
    width: 100%;
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    padding: 0.25rem;
    height: 3rem;
    display: flex;
    align-items: center;
    background: ${(props) => props.theme.background3};
    transition: border 0.2s ease-in-out;
    position: relative;

    > input {
        background: transparent;
        height: 100%;
        width: 100%;
        overflow-x: hidden;
        border: none;
        outline: none;
        color: ${(props) => props.theme.primary};
        word-wrap: break-word;
        word-break: break-all;
    }

    &:hover,
    &:focus-within {
        border: 1px solid ${(props) => props.theme.accentColor};
    }

    span.loading {
        position: absolute;
        right: 0;
        height: 100%;
        padding: 0 0.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid ${(props) => props.theme.borderColor};

        > svg {
            color: ${(props) => props.theme.accentColor};
            animation: ${spinAnimation} 0.5s linear infinite;
        }
    }
`;

export const SwapDetailWrapper = styled.div`
    ${swapPadding}
`;

export const SwapDetailContent = styled.div`
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    background: ${(props) => props.theme.background3};
    ${swapPadding}
    display: flex;
    flex-direction: column;
    font-size: 0.85rem;
`;

export const SwapDetailRow = styled.div`
    display: flex;
    justify-content: space-between;
    font-weight: ${(props) => props.theme.bolderFont};
`;
