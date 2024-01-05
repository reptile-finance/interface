import styled from 'styled-components';

export const FarmsWrapper = styled.div`
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    width: 100%;
`;

export const FarmsTitle = styled.div`
    padding: ${(props) => props.theme.boxPadding};
    border-bottom: 1px solid ${(props) => props.theme.borderColor};

    .title {
        font-weight: ${(props) => props.theme.bolderFont};
        color: ${(props) => props.theme.accentColor};
    }
`;

export const FarmsContent = styled.div`
    padding: ${(props) => props.theme.boxPadding};
`;

export const FarmsTable = styled.div`
    margin-top: 0.5rem;
    border-radius: ${(props) => props.theme.borderRadius};
    border: 1px solid ${(props) => props.theme.borderColor};
    background: ${(props) => props.theme.background3};
    display: flex;
    flex-direction: column;
`;

export const FarmsTableRow = styled.div`
    grid-template-columns: 2fr 1fr 1fr 2fr 1fr 2fr;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    padding: 0.5rem 1rem;
    display: grid;
    align-items: center;

    &:hover {
        background: ${(props) => props.theme.background4};
    }
`;

export const FarmsTableRowHeader = styled(FarmsTableRow)`
    font-weight: ${(props) => props.theme.bolderFont};
`;

export const FarmsNameWrapper = styled.span`
    display: flex;
    align-items: center;

    .name {
        width: 100%;
        font-weight: ${(props) => props.theme.bolderFont};
    }
`;

export const FarmsLogosWrapper = styled.span`
    position: relative;
    width: 4rem;
    height: 1.5rem;

    > img {
        position: absolute;
        width: 1.5rem;
        height: auto;

        &:first-child {
            top: 0;
            left: 0;
            z-index: 2;
        }

        &:last-child {
            top: 0;
            left: 1rem;
            z-index: 1;
        }
    }
`;

export const FarmsActionsWrapper = styled.span`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    > button {
        margin-left: 0.5rem;
    }
`;
