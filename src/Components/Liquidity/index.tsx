import { usePools } from '../../Hooks/usePools';
import { LiquidityRow } from './LiquidityRow';
import {
    LiquidityPositionsRowHeader,
    LiquidityPositionsTable,
    LiquidityTitle,
    LiquidityWrapper,
    LiquidtyContent,
} from './Styles';

export const Liquidity = () => {
    const { pools } = usePools();

    return (
        <LiquidityWrapper>
            <LiquidityTitle>
                <div className="title">Your Liquidity</div>
                <div>Manage your liquidity positions (LPs)</div>
            </LiquidityTitle>
            <LiquidtyContent>
                <LiquidityPositionsTable>
                    <LiquidityPositionsRowHeader>
                        <span>Liquidity Pool</span>
                        <span>Balance</span>
                        <span></span>
                    </LiquidityPositionsRowHeader>
                    {Object.keys(pools).map((pool, idx) => (
                        <LiquidityRow key={idx} pool={{ pool, ...pools[pool] }} />
                    ))}
                </LiquidityPositionsTable>
            </LiquidtyContent>
        </LiquidityWrapper>
    );
};
