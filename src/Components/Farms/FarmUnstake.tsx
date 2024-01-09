import styled from "styled-components"
import { Input } from "../Input"
import { FC, PropsWithoutRef, useMemo, useState } from "react"
import { Button } from "../Button"
import { useFarmController } from "../../Hooks/useFarmController"
import { formatEther, parseEther } from "viem"
import { useFarmsStake } from "../../Hooks/useFarmsStake"
import { erc20ABI, useContractRead, useWalletClient } from "wagmi"
import { useFarms } from "../../Hooks/useFarms"

export const FarmUnstake: FC<PropsWithoutRef<{
    lpIndex: number;
    onClose?: () => void;
}>> = ({ lpIndex, onClose }) => {
    const [amount, setAmount] = useState<string>("0")

    const { unstake } = useFarmController()
    const { result: userStakes } = useFarmsStake()

    const userFarmStake = userStakes?.[lpIndex]?.amount

    const ButtonAction = useMemo(() => {
        if (parseEther(amount) === 0n) return <Button disabled>Enter an amount</Button>
        if (parseEther(amount) > userFarmStake) return <Button disabled>Current stake is below</Button>
        return <Button onClick={() => unstake(lpIndex, parseEther(amount)).then(onClose)}>Withdraw</Button>
    }, [amount, lpIndex, onClose, unstake, userFarmStake])

    return <FarmStakeWrapper>
        <h1>Unstake</h1>
        <p>Withdraw your LP tokens</p>
        <Input title={`Withdrawable balance: ${userFarmStake ? formatEther(userFarmStake) : "Loading..."}`} value={amount} onChange={(v) => setAmount(v.target.value)} />
        {ButtonAction}
    </FarmStakeWrapper>
}

const FarmStakeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`