import { Icon, TokenInfo, TokenListItem, TokenName, TokenNameColumn } from './Styles';
import { EthAddress } from '../../Types';
import { IconsProvider } from '../../Providers/Icons';
import { useBalances } from '../../Hooks/useBalances';
import { useMemo } from 'react';
import { formatBalance } from '../../Utils/Bignumber';
import { useToken } from '../../Hooks/useToken';

export const TokenRow: React.FC<{
    address: EthAddress;
    onClick: (token: string) => void;
}> = ({ address, onClick }) => {
    const { getBalance } = useBalances();
    const { data, isLoading, isError } = useToken({
        address,
    });

    const balance = useMemo(() => {
        const bal = getBalance(address);
        return formatBalance(bal, 4, data?.decimals ?? 18);
    }, [address, data?.decimals, getBalance]);

    if (isLoading || !data || isError) return null;

    return (
        <TokenListItem onClick={() => onClick(address)}>
            <TokenInfo>
                <Icon src={IconsProvider.getIconUrlByAddress(address)} />
                <TokenNameColumn>
                    <TokenName>{data.name}</TokenName>
                    <span>{data.symbol}</span>
                </TokenNameColumn>
            </TokenInfo>
            <span>
                {balance} {data.symbol}
            </span>
        </TokenListItem>
    );
};
