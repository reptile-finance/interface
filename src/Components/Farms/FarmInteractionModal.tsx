import { FC, PropsWithChildren } from "react"
import { Modal } from "../Modal"
import { FarmStake } from "./FarmStake"
import { FarmUnstake } from "./FarmUnstake"

export type TFarmInteractionModalType = "stake" | "unstake"


export const FarmInteractionModal: FC<PropsWithChildren<{
    onClose: () => void;
    type?: TFarmInteractionModalType | null;
    lpIndex?: number;
}>> = ({ lpIndex, onClose, type = null }) => {
    return <Modal isOpen={type !== null} onClose={onClose}>
        {
            type === 'stake' ? <FarmStake onClose={onClose} lpIndex={lpIndex} /> : <FarmUnstake onClose={onClose} lpIndex={lpIndex} />
        }
    </Modal>
}
