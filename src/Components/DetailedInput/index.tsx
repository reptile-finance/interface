import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Input } from "../Input";
import styled from "styled-components";
import { base } from "../../Theme";
import { Address } from "viem";

export type TokenInputProps = {
  title: string;
  onChange?: (token: string) => void;
};

export const DetailedInput = ({ title, onChange }: TokenInputProps) => {
  const [selectedToken, setSelectedToken] = useState<string>("");

  const onTokenChange = useCallback(
    (v: ChangeEvent<HTMLInputElement>) =>
      setSelectedToken(v.target.value as Address),
    [setSelectedToken]
  );

  useEffect(() => {
    onChange && onChange(selectedToken);
  }, [selectedToken, onChange]);

  return (
    <InputWrapper>
      <InputTitle>{title}</InputTitle>
      <PositionedInput
        value={selectedToken}
        onChange={onTokenChange}
        placeholder="0x..."
      />
    </InputWrapper>
  );
};

const PositionedInput = styled(Input)`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 5em;
  div,
  input {
    height: 100%;
  }
`;

const InputTitle = styled.p`
  font-size: 0.8rem;
  color: ${base.primary};
  opacity: 0.5;
  position: absolute;
  top: -0.5em;
  left: 1em;
`;
