import styled, { css } from 'styled-components';
import { Button } from '../Button';

export const AddLiquidityWrapper = styled.div`
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    width: 70%;
    @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
        width: 100%;
    }
`;

const swapPadding = css`
    padding: ${(props) => props.theme.boxPadding};
`;

export const AddLiquidityActionButtonWrapper = styled.div`
    ${swapPadding}
`;

export const AddLiquidityActionButton = styled(Button)`
    width: 100%;
    padding: 0.75rem;
`;

export const AddLiquidityHeader = styled.div`
    display: flex;
    align-items: baseline;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    ${swapPadding}

    .swap {
        font-weight: ${(props) => props.theme.bolderFont};
        color: #fff;
        color: ${(props) => props.theme.accentColor};
    }
`;

export const AddLiquidityInputBox = styled.div`
    display: flex;
    flex-direction: column;
    ${swapPadding}
`;

export const AddLiquidityInputTokenBalances = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;

    span:first-child {
        font-weight: ${(props) => props.theme.bolderFont};
    }
`;

export const AddLiquidityBoxToken = styled.span`
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

export const AddLiquidityInputNumber = styled.div`
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
`;

export const LiquiditySummaryWrapper = styled.div`
    ${swapPadding}
    margin: ${(props) => props.theme.boxPadding};
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: ${(props) => props.theme.borderRadius};
    background: ${(props) => props.theme.background3};

    .error {
        text-align: center;
    }
`;

export const LiquditySummaryLpWrapper = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 0.85rem;
    font-weight: ${(props) => props.theme.bolderFont};
`;

export const LiquditySummaryLpRow = styled.div`
    display: flex;
    justify-content: space-between;
`;
