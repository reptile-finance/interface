import { useToken } from '../../Hooks/useToken';
import { EthAddress } from '../../Types';

export const TokenSymbol: React.FC<{ token: EthAddress }> = ({ token }) => {
    const { data } = useToken({
        address: token,
    });

    if (data) return <>{data.symbol}</>;

    return null;
};
