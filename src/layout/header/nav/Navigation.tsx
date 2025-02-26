import { useLinkStore } from "@/store/link";
import { Button } from "@mui/material";
import { useCallback } from "react";


function Navigation() {
    const { link, updateLink } = useLinkStore();

    const btnProps = useCallback((itemlink: string) => {
        return ({
            variant: link === itemlink ? 'contained' : 'outlined' as 'contained' | 'outlined',
            onClick: updateLink.bind(null, itemlink)
        });
    }, [link]);

    return (
        <nav className="p-2 border-b border-b-gray-300 flex flex-row gap-2">
            <Button {...btnProps('/')}>SECS to Item</Button>
            <Button {...btnProps('/item-to-secs')}>Item To Secs</Button>
        </nav>
    );
}

export default Navigation;