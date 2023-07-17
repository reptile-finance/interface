import { InputWrapper, StyledInput, TitleWrapper } from "./Styles";

export const Input: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { title?: string }
> = (props) => {
  return (
    <InputWrapper>
      {props.title && <TitleWrapper>{props.title}</TitleWrapper>}
      <StyledInput {...props} />
    </InputWrapper>
  );
};
