import { useNavigate } from 'react-router-dom';
import {
    EarnActionButton,
    EarnAdActions,
    EarnAdCardBody,
    EarnAdCardContent,
    EarnAdCardImage,
    EarnAdCardWrapper,
    EarnAddCardHeader,
} from './Styles';

export const EarnAdCard = () => {
    const navigate = useNavigate();

    return (
        <EarnAdCardWrapper>
            <EarnAdCardContent>
                <EarnAddCardHeader>
                    <EarnAdCardImage />
                    Improve your earnings
                </EarnAddCardHeader>
                <EarnAdCardBody>
                    Contribute by providing liquidity and maximize your income by participating in staking farms. <br />
                    By locking your LP Tokens in these farms, you not only support the stability of the ecosystem but also
                    earn rewards in the form of Reptile Tokens. <br/>
                    This strategy allows you to significantly increase your
                    assets, fully leveraging the potential of your cryptocurrency investments
                </EarnAdCardBody>
                <EarnAdActions>
                    <EarnActionButton onClick={() => navigate('/earn')}> Go To Farms </EarnActionButton>
                </EarnAdActions>
            </EarnAdCardContent>
        </EarnAdCardWrapper>
    );
};
