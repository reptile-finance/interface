import styled from 'styled-components';

export const ReptileWrapper = styled.div``;

export const ReptileTitleWrapper = styled.div`
    padding: ${(props) => props.theme.boxPadding};
    border-bottom: 1px solid ${(props) => props.theme.borderColor};

    .title {
        font-weight: ${(props) => props.theme.bolderFont};
        color: ${(props) => props.theme.accentColor};
    }
`;

export const ReptileContentWrapper = styled.div`
    padding: ${(props) => props.theme.boxPadding};
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 1rem;
    gap: 2rem;

    [data-reptile-content='link'] {
        cursor: pointer;
    }

    @media only screen and (max-width: ${(props) => props.theme.breakpoints.md}) {
        flex-direction: column;
    }
`;

export const ReptileTokenInfoWrapper = styled.div`
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: ${(props) => props.theme.borderRadius};
    max-width: 30rem;
    width: 100%;

    .bolder {
        font-weight: ${(props) => props.theme.bolderFont};
        color: ${(props) => props.theme.accentColor};
    }
`;

export const ReptileTokenInfo = styled.div`
    display: flex;
    align-items: center;
    padding: ${(props) => props.theme.boxPadding};
    gap: 0.5rem;
    border-bottom: 1px solid ${(props) => props.theme.borderColor};
    background-color: ${(props) => props.theme.accentBackground2};

    > img {
        width: 3rem;
        height: auto;
    }

    > span {
        display: flex;
        flex-direction: column;
    }
`;

export const ReptileTokenInfoDetail = styled.div`
    padding: ${(props) => props.theme.boxPadding};
    display: flex;
    flex-direction: column;

    > div {
        padding: 0.25rem 0;
    }
`;

export const ReptileTokenListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding-top: 1rem;
    max-height: 15rem;
    overflow-y: auto;
    padding: ${(props) => props.theme.boxPadding};

    div {
        display: flex;
        justify-content: space-between;

        > span {
            display: flex;
            align-items: center;
            gap: 0.5rem;

            &:first-child {
                img {
                    width: 1.5rem;
                    height: auto;
                }
            }
        }
    }
`;

export const ReptileTokenListHeader = styled(ReptileTokenInfo)`
    flex-direction: column;
    align-items: flex-start;
    gap: 0;
`;
