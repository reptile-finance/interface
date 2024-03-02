import styled from 'styled-components';

export const OverviewBalance = styled.div`
    padding: 2rem 1.5rem;

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.xs}) {
        padding: 1.5rem 0.75rem;
    }
`;

export const WelcomeMsg = styled.div`
    font-size: 1.25rem;
    font-weight: ${(props) => props.theme.bolderFont};
`;

export const WelcomeBalance = styled.div`
    font-size: 3rem;
    font-weight: ${(props) => props.theme.bolderFont};

    > span {
        font-size: 1.2rem;
        font-weight: 300;
        color: ${(props) => props.theme.accentColor};
    }
`;

export const OverviewContent = styled(OverviewBalance)`
    display: flex;

    > * {
        align-self: baseline;
    }

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.xs}) {
        flex-direction: column;

        > * {
            margin-bottom: 1rem;
        }
    }
`;

export const Tabs = styled.div`
    display: flex;
    align-items: center;
    flex-direction: row;
    padding: 0 2rem;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

export const TabsItem = styled.div`
    margin-right: 2rem;
    font-weight: ${(props) => props.theme.bolderFont};
    cursor: pointer;
    padding: 1rem 0.5rem;
    border-bottom: 1px solid transparent;
    color: ${(props) => props.theme.secondary};
    position: relative;

    &::before {
        content: '';
        display: inline-block;
        width: 0%;
        height: 2px;
        position: absolute;
        bottom: 0;
        left: 0;
        background: ${(props) => props.theme.accentColor};
        transition: width 0.2s ease-in-out;
    }

    &.active,
    &:hover {
        color: ${(props) => props.theme.primary};

        &::before {
            width: 100%;
        }
    }
`;

export const SwapWrapper = styled.div`
    width: 100%;
    display: flex;
    gap: 4rem;
    justify-content: center;

    @media (max-width: ${(props) => props.theme.breakpoints.md}) {
        flex-direction: column;
        align-items: center;
    }
`;

export const SwapBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    @media (max-width: ${(props) => props.theme.breakpoints.md}) {
        width: 100%;
    }
`;

export const LiquidityWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`;
