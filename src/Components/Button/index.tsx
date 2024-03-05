import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import React from 'react';
import { StyledButton, StyledButtonAlt, StyledButtonDanger, StyledFilledButton } from './Styles';

export function Button(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        loading?: string;
        disabled?: boolean;
    },
) {
    return <StyledButton {...props}>{!props.loading && props.children}</StyledButton>;
}

export function ButtonAlt(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        loading?: string;
        disabled?: boolean;
    },
) {
    return (
        <StyledButtonAlt {...props}>{!props.loading && props.children}</StyledButtonAlt>
    );
}

export function ButtonDanger(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        loading?: string;
        disabled?: boolean;
    },
) {
    return (
        <StyledButtonDanger {...props}>
            {!props.loading && props.children}
        </StyledButtonDanger>
    );
}

export function FilledButton(
    props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
        loading?: string;
        disabled?: boolean;
    },
) {
    return (
        <StyledFilledButton {...props}>
            {!props.loading && props.children}
        </StyledFilledButton>
    );
}
