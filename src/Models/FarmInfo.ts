import { EthAddress } from '../Types';

export type EncodedFarmInfo = [
    lpToken: EthAddress,
    allocPoint: bigint,
    lastRewardBlock: bigint,
    accCakePerShare: bigint,
];

export interface FarmInfo {
    lpToken: EthAddress;
    allocPoint: bigint;
    lastRewardBlock: bigint;
    accCakePerShare: bigint;
}
