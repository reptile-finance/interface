import styled from 'styled-components';
import { Button } from '../Button';

export const RemoveLiquidityWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

export const RemoveLiquidityInputNumber = styled.div`
    margin-top: 0.5rem;
    width: 100%;
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    padding: 0.25rem;
    height: 3rem;
    display: flex;
    align-items: center;
    background: ${(props) => props.theme.background2};
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

export const RemoveLiquidityInputTokenBalances = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.8rem;

    span:first-child {
        font-weight: ${(props) => props.theme.bolderFont};
    }
`;

export const RemoveLiquidityBoxToken = styled.span`
    padding: 0.15rem 0.5rem;
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    background: ${(props) => props.theme.background2};
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

export const RemoveLiquidityActionButton = styled(Button)`
    width: 100%;
    padding: 0.75rem;
`;

export const RemoveLiquidityExchangeWrapper = styled.div`
    margin: 0.5rem 0;
    padding: ${(props) => props.theme.boxPadding};
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    background: ${(props) => props.theme.background2};
    font-size: 0.85rem;

    > div {
        display: flex;
        justify-content: space-between;
    }
`;
