import styled, { css, keyframes } from 'styled-components';

export const Button = styled.button<{ loading?: string; disabled?: boolean }>`
    border-radius: ${(props) => props.theme.borderRadius};
    background: ${(props) => props.theme.accentBackground};
    border: 1px solid ${(props) => props.theme.accentColor};
    color: ${(props) => props.theme.accentColor};
    padding: 0.5rem 1rem;
    outline: 0;
    font-weight: ${(props) => props.theme.bolderFont};
    cursor: pointer;
    transition: scale 0.2s;
    display: flex;
    justify-content: space-around;
    align-items: center;

    ${(p) =>
        p.disabled &&
        css`
            opacity: 0.5;
            cursor: inherit;
        `}

    ${(p) =>
        p.loading === 'true' &&
        css`
            color: #fff;
            background-size: 300% 300%;
            background-image: linear-gradient(
                -45deg,
                ${(props) => props.theme.accentColor} 0%,
                ${(props) => props.theme.accentColor} 25%,
                ${(props) => props.theme.accentBackground2} 51%,
                ${(props) => props.theme.accentColor} 100%
            );
            animation: ${animatedBg} 5s ease infinite;
        `}

    transition: background 0.3s, color 0.5s;
    &:hover {
        background: ${(props) => props.theme.accentColor};
        color: black !important;
    }
`;

const animatedBg = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export const ButtonAlt = styled(Button)`
    background: ${(props) => props.theme.accentBackground2};
    border: 1px solid ${(props) => props.theme.accentColor2};
    color: ${(props) => props.theme.accentColor2};
`;

export const ButtonDanger = styled(Button)`
    background: ${(props) => props.theme.accentBackground2};
    border: 1px solid ${(props) => props.theme.colors.red};
    color: ${(props) => props.theme.colors.red};
`;

export const FilledButton = styled.button`
    border-radius: ${(props) => props.theme.borderRadius};
    background: ${(props) => props.theme.background3};
    border: 1px solid ${(props) => props.theme.accentColor};
    color: ${(props) => props.theme.accentColor};
    padding: 0.5rem 1rem;
    font-weight: ${(props) => props.theme.bolderFont};
    cursor: pointer;
    transition: scale 0.2s;

    &:hover {
        scale: 1.01;
    }
`;
