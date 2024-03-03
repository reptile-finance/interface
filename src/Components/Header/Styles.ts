import styled from 'styled-components';

export const HeaderWrapper = styled.div`
    width: 95%;
    height: 10vh;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
        justify-content: space-between;
    }
`;

export const HeaderNavigation = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: auto;
    height: 100%;
`;

export const LogoItem = styled.img`
    width: 3.5rem;
    height: auto;
    margin-right: 2rem;
    cursor: pointer;
`;

export const HeaderItem = styled.div`
    margin-left: 1rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
        padding: 0.5rem 1rem;
        border-radius: ${(props) => props.theme.borderRadius};
        cursor: pointer;
        white-space: nowrap;
        display: flex;
        align-items: center;
    }

    svg {
        display: none;
        height: 1rem;
        width: 1rem;
        margin-left: 1rem;
        margin-right: 1rem;
        cursor: pointer;
        > path {
            stroke: #fff;
        }
        color: #fff;
    }

    &:not(.active) {
        span {
            transition: all 0.2s ease-in-out;
            &:hover {
                background: ${(props) => props.theme.borderColor};
            }
        }
    }

    &.active {
        span {
            color: ${(props) => props.theme.accentColor};
        }
        svg {
            height: 1rem;
            width: 1rem;
            > path {
                stroke: ${(props) => props.theme.accentColor};
            }
            color: ${(props) => props.theme.accentColor};
        }
    }

    &.wallet {
        display: none;
    }

    &.wrong-network {
        display: none;
        span {
            color: #ff494a;
        }
        svg {
            > path {
                stroke: #ff494a;
            }
            color: #ff494a;
        }
    }

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
        margin-left: 0;
        span {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
        }
        &.wallet {
            display: flex;
        }
        &.wrong-network {
            display: flex;
        }
    }

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.xs}) {
        span {
            display: none;
        }
        svg {
            display: block;
        }
    }
`;

export const AccountWrapper = styled.div`
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
        display: none;
    }
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
