import { zeroAddress } from 'viem';
import {
    AddLiquidityActionButton,
    AddLiquidityActionButtonWrapper,
    AddLiquidityHeader,
    AddLiquidityWrapper,
} from './Styles';
import { AddLiquidityBox } from './AddLiquidityBox';

export const AddLiquidity = () => {
    return (
        <AddLiquidityWrapper>
            <AddLiquidityHeader>
                <span className="swap">Add Liquidity</span>
            </AddLiquidityHeader>
            <AddLiquidityBox defaultToken={zeroAddress} />
            <AddLiquidityBox defaultToken={zeroAddress} />
            <AddLiquidityActionButtonWrapper>
                <AddLiquidityActionButton>Add Liquidity / Approve</AddLiquidityActionButton>
            </AddLiquidityActionButtonWrapper>
        </AddLiquidityWrapper>
    );
};
