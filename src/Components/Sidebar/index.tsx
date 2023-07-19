import { SidebarItem, SidebarMobileToggle, SidebarWrapper } from './Styles';
import { VscPreview, VscMap, VscRepo, VscMenu, VscRocket } from 'react-icons/vsc';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useMediaQuery, useOnClickOutside } from 'usehooks-ts';
import { base } from '../../Theme';

export const Sidebar = () => {
    const navigateHandler = useNavigate();
    const location = useLocation();
    const matches = useMediaQuery(`(max-width: ${base.breakpoints.xs})`);
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const sectionTitle = useMemo(() => {
        const title = location.pathname.replace('/', '');
        return title.length > 0 ? title : 'Overview';
    }, [location.pathname]);

    const shouldBeOpen = useMemo(() => {
        if (!matches) return true;
        return isOpen;
    }, [isOpen, matches]);

    const navigate = useCallback(
        (location: string) => {
            navigateHandler(location);
            if (matches) setIsOpen(false);
        },
        [matches, navigateHandler],
    );

    useOnClickOutside(ref, () => {
        if (matches) setIsOpen(false);
    });

    return (
        <>
            {matches && !isOpen && (
                <SidebarMobileToggle>
                    <VscMenu onClick={() => setIsOpen((st) => !st)} />
                </SidebarMobileToggle>
            )}
            <SidebarWrapper className={shouldBeOpen ? 'active' : 'no-active'} ref={ref}>
                <h2>Reptile</h2>
                <SidebarItem
                    onClick={() => navigate('/overview')}
                    className={/overview/i.test(sectionTitle) ? 'active' : undefined}
                >
                    <VscPreview />
                    <span>Overview</span>
                </SidebarItem>
                <SidebarItem
                    onClick={() => navigate('/earn')}
                    className={/earn/i.test(sectionTitle) ? 'active' : undefined}
                >
                    <VscRocket />
                    <span>Earn</span>
                </SidebarItem>
                <SidebarItem onClick={() => window.open('https://opbnbscan.com/', '_blank')}>
                    <VscMap />
                    <span>Explorer</span>
                </SidebarItem>
                <SidebarItem onClick={() => window.open('https://google.com', '_blank')}>
                    <VscRepo />
                    <span>Docs</span>
                </SidebarItem>
            </SidebarWrapper>
        </>
    );
};
