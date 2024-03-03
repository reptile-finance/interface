import styled from 'styled-components';
import { Button } from '../Button';
import { FaCoins } from 'react-icons/fa6';
import BackgroundImage from '../../Assets/Backgrounds/green_gradient.jpg';

export const EarnAdCardWrapper = styled.div`
    width: auto;
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: ${(props) => props.theme.borderRadius};
    background: url(${BackgroundImage});
    background-size: cover;
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
    background-color: transparent;
    padding: 0.75rem;
    border: 1px solid #fff;
    color: #fff;
    &:hover {
        background-color: rgba(255, 255, 255, 0.7);
    }
`;
