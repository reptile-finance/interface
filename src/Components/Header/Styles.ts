import styled from 'styled-components';

export const HeaderWrapper = styled.div`
    width: 95%;
    height: 4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
      justify-content: center;
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
    width: 2rem;
    height: auto;
    margin-right: 2rem;
    @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
        display: none;
    }
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
    }

    &.no-active {
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
    }

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
        margin-left: 0;
        span {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
        }
    }
`;

export const AccountWrapper = styled.div`
    display: flex;
    align-items: center;
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
