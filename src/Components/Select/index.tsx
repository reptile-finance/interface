import { useCallback, useEffect, useRef, useState } from "react";
import {
  SelectCurrent,
  SelectList,
  SelectListItem,
  SelectWrapper,
} from "./Styles";
import { VscChevronDown, VscChevronUp } from "react-icons/vsc";
import { useOnClickOutside } from "usehooks-ts";
import { ReactNode } from "react";

interface Option {
  label: ReactNode;
  value: string;
}
export const Select: React.FC<{
  options: Option[];
  onChange?: (opt: string) => void;
  selected?: string;
}> = ({ options, onChange, selected }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [option, setOption] = useState<string>(options[0].value);
  const ref = useRef<HTMLDivElement>(null);

  const toggling = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  const onOptionClicked = useCallback(
    (value: string) => {
      setOption(value);
      setIsOpen(false);
      if (onChange) onChange(value);
    },
    [onChange]
  );

  useEffect(() => {
    if (selected) {
      setOption(selected);
    }
  }, [selected]);

  useOnClickOutside(ref, () => setIsOpen(false));
  
  return (
    <SelectWrapper ref={ref}>
      <SelectCurrent
        onClick={toggling}
        className={isOpen ? "active" : "no-active"}
      >
        <span>{options.find((o) => o.value === option)?.label ?? "Please select"}</span>
        <span>{isOpen ? <VscChevronUp /> : <VscChevronDown />}</span>
      </SelectCurrent>
      {isOpen && (
        <SelectList>
          {options
            .filter((o) => o.value !== option)
            .map((opt, i) => (
              <SelectListItem key={i} onClick={() => onOptionClicked(opt.value)}>
                {opt.label}
              </SelectListItem>
            ))}
        </SelectList>
      )}
    </SelectWrapper>
  );
};
