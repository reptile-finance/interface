import { useCallback, useEffect, useMemo, useState } from 'react';
import { EthAddress } from '../../Types';
import { Modal } from '../Modal';
import { ActionWrapper, TokenList, TokenSearchWrapper } from './Styles';
import { ButtonAlt } from '../Button';
import { TokenRow } from './TokenRow';
import { useConfig } from '../../Hooks/useConfig';
import { useRecoilValue } from 'recoil';
import { TokensState } from '../../State/Tokens';
import Fuse from 'fuse.js';
import { isAddress } from 'viem';
import { useToken } from '../../Hooks/useToken';

export type TokenSelectorProps = {
    open: boolean;
    setOpen?: (open: boolean) => void;
    setToken?: (token: EthAddress) => void;
};

export const TokenSelector = ({ open, setOpen, setToken }: TokenSelectorProps) => {
    const { getTokens } = useConfig();
    const [supportedTokens, setSupportedTokens] = useState<EthAddress[]>([]);
    const [search, setSearch] = useState<string>('');
    const tokens = useRecoilValue(TokensState);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _tokenCfg = useToken({
        // Hack for adding custom new tokens
        address: isAddress(search) && !tokens[search.toLowerCase() as EthAddress] ? search : undefined,
    });

    useEffect(() => {
        getTokens().then((tokens) => {
            setSupportedTokens(tokens);
        });
    }, [getTokens, setSupportedTokens]);

    const onClose = useCallback(() => setOpen && setOpen(false), [setOpen]);

    const onTokenClick = useCallback(
        (token: EthAddress) => {
            setToken && setToken(token);
            onClose();
        },
        [setToken, onClose],
    );

    const Actions = useMemo(
        () => (
            <ActionWrapper>
                <ButtonAlt onClick={() => onClose()}>Cancel</ButtonAlt>
            </ActionWrapper>
        ),
        [onClose],
    );

    const onSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value), []);

    const filteredTokens = useMemo(() => {
        if (!search) return supportedTokens;
        const fuse = new Fuse(Object.values(tokens), { keys: ['name', 'symbol', 'address'] });
        return fuse.search(search).map((result) => result.item.address);
    }, [search, supportedTokens, tokens]);

    useEffect(() => {
        if (!open) setSearch('');
    }, [open, setSearch]);

    return (
        <Modal title="Choose a Token" isOpen={open} onClose={onClose} actions={Actions}>
            <TokenSearchWrapper>
                <input type="text" placeholder="Search by name or paste address (0x)..." onChange={onSearchChange} />
            </TokenSearchWrapper>
            <TokenList>
                {filteredTokens.map((token, idx) => (
                    <TokenRow key={idx} address={token} onClick={() => onTokenClick(token)} />
                ))}
            </TokenList>
        </Modal>
    );
};
