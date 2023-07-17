import ModalComp from "react-modal";
import { base } from "../../Theme";
import {
  RewardsModalActions,
  RewardsModalContent,
  RewardsModalTitle,
} from "./Styles";
import { PropsWithChildren } from "react";

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "500px",
    width: "100%",
    backgroundColor: base.background3,
    border: `1px solid ${base.borderColor}`,
    borderRadius: base.borderRadius,
    zIndex: 1000,
    padding: 0,
  },
};

export const Modal: React.FC<
  PropsWithChildren<{
    title?: string;
    actions?: React.ReactNode;
    isOpen: boolean;
    onClose?: () => void;
  }>
> = ({ title, actions, children, isOpen, onClose }) => {
  return (
    <ModalComp
      isOpen={isOpen}
      overlayClassName={"modal-overlay"}
      style={modalStyles}
      onRequestClose={onClose}
    >
      {title && (
        <RewardsModalTitle>
          <div>{title}</div>
        </RewardsModalTitle>
      )}
      <RewardsModalContent>{children}</RewardsModalContent>
      {actions && <RewardsModalActions>{actions}</RewardsModalActions>}
    </ModalComp>
  );
};
