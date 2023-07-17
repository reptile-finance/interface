import styled from 'styled-components';

export const SidebarMobileToggle = styled.span`
    position: fixed;
    bottom: 0.5rem;
    left: 0.5rem;
    z-index: 100000;
    border-radius: 50%;
    padding: 0.5rem;
    background: ${(props) => props.theme.background4};
    border: 1px solid ${(props) => props.theme.borderColor};
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    justify-content: center;
    align-items: center;

    > svg {
        fill: #fff;
    }
`;

export const SidebarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 250px;
    align-items: center;

    > img {
        filter: invert(1);
        margin: 2rem 1rem;
        width: 65%;
        cursor: pointer;
    }

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.xs}) {
        position: fixed;
        height: 100vh;
        max-height: 100vh;
        left: -280px;
        top: 0;
        transition: left 0.3s ease-in-out;
        z-index: 10000;
        background: ${(props) => props.theme.background};
        border-right: 1px solid ${(props) => props.theme.borderColor};
        overflow-y: hidden;

        &.no-active {
        }

        &.active {
            left: 0;
        }
    }
`;

export const SidebarItem = styled.div`
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    font-weight: ${(props) => props.theme.bolderFont};
    font-size: 0.9rem;
    width: 100%;
    transition: color 0.3s ease-in-out;
    cursor: pointer;
    color: ${(props) => props.theme.secondary};

    :hover {
        color: ${(props) => props.theme.primary};
    }

    > svg,
    span {
        margin-right: 0.5rem;
    }

    > svg {
        width: 1.25rem;
        height: auto;
    }

    &.active {
        color: #fff;
    }
`;

export const SidebarFeedback = styled.div`
    margin: 2rem 0;
    width: 90%;
    border-radius: ${(props) => props.theme.borderRadius};
    background-color: ${(props) => props.theme.background3};
    border: 2px solid ${(props) => props.theme.borderColor};
    padding: 0.5rem 1rem;
    text-align: center;
    text-justify: justify;
    font-size: 0.8rem;
`;
