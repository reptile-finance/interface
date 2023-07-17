import IduiPopover, { PopoverProps } from '@idui/react-popover';
import { CustomPopover } from './Styles';

export const Popover: React.FC<React.ComponentProps<typeof IduiPopover>> = ({
  isOpen,
  children,
  ...otherProps
}: PopoverProps) => {
  return isOpen ? (
    <CustomPopover isOpen={isOpen} {...otherProps}>
      {children}
    </CustomPopover>
  ) : (
    <>{children}</>
  );
};
