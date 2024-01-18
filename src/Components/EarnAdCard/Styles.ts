import styled, {keyframes} from 'styled-components';
import { Button } from '../Button';
import { FaCoins } from 'react-icons/fa6';

const GradientBackground = keyframes`
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

export const EarnAdCardWrapper = styled.div`
    width: 50%;
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: ${(props) => props.theme.borderRadius};
    background: linear-gradient(45deg, #000000, #4CAF50);
    background-size: 400% 400%;
    animation: GradientBackground 10s ease infinite;
    animation: ${GradientBackground} 10s ease infinite;
    @media (max-width: ${(props) => props.theme.breakpoints.md}) {
        width: 100%;
    }
`;

export const EarnAdCardContent = styled.div`
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.3rem;
    height: 100%;
    justify-content: space-between;
`;

export const EarnAdCardImage = styled(FaCoins)`
    margin-right: 0.5rem;
    color: ${(props) => props.theme.primary};
    font-size: 2rem;
`;

export const EarnAddCardHeader = styled.div`
    display: flex;
    gap: 0.8rem;
    width: 100%;
    margin-top: 1rem;
    margin-bottom: 1rem;
    font-weight: ${(props) => props.theme.bolderFont};
    font-size: 1.2rem;
`;

export const EarnAdActions = styled.div`
    width: 100%;
`;

export const EarnAdCardBody = styled.div`
    font-size: 1rem;
`;

export const EarnActionButton = styled(Button)`
    width: 100%;
    margin-top: 1rem;
    background: rgba(23, 32, 38, 255);
    padding: 0.75rem;
`;
