import styled from "styled-components"
import { Input } from "../Input"
import { FC, PropsWithoutRef, useMemo, useState } from "react"
import { Button, ButtonAlt } from "../Button"
import { erc20ABI, useContractRead, useWalletClient } from "wagmi"
import { useFarms } from "../../Hooks/useFarms"
import { useFarmController } from "../../Hooks/useFarmController"
import { formatEther, parseEther } from "viem"
import { useERC20 } from "../../Hooks/useERC20"

export const FarmStake: FC<PropsWithoutRef<{
    lpIndex: number;
    onClose?: () => void;
}>> = ({ lpIndex, onClose }) => {
    const [amount, setAmount] = useState<string>("0")

    const { data: wallet } = useWalletClient()
    const { approve } = useERC20()
    const { stake, address: farmControllerAddress } = useFarmController()
    const { result: farms } = useFarms()

    const { data: allowance } = useContractRead({
        abi: erc20ABI,
        address: farms?.[lpIndex]?.lpToken,
        functionName: "allowance",
        args: [wallet?.account?.address, farmControllerAddress],
    })

    const { data: balance } = useContractRead({
        abi: erc20ABI,
        address: farms?.[lpIndex]?.lpToken,
        functionName: "balanceOf",
        args: [wallet?.account?.address],
    })

    const ButtonAction = useMemo(() => {
        if (parseEther(amount) === 0n) return <Button disabled>Enter an amount</Button>
        if (parseEther(amount) > balance) return <Button disabled>Insufficient balance</Button>
        if (parseEther(amount) > allowance) return <ButtonAlt onClick={() => approve(farms?.[lpIndex]?.lpToken, farmControllerAddress, parseEther(amount))}>Approve</ButtonAlt>
        return <Button onClick={() => stake(lpIndex, parseEther(amount)).then(onClose)}>Stake</Button>
    }, [allowance, amount, approve, balance, farmControllerAddress, farms, lpIndex, onClose, stake])

    return <FarmStakeWrapper>
        <h1>Stake</h1>
        <p>Stake your LP tokens to earn Reptiles</p>
        <Input title={`Balance: ${balance ? formatEther(balance) : 'Loading...'}`} value={amount} onChange={(v) => setAmount(v.target.value)} />
        {ButtonAction}
    </FarmStakeWrapper>
}

const FarmStakeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`