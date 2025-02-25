import { Button } from "@mui/material";
import { useCallback } from "react";
import { Link, useLocation } from "react-router";


function Navigation() {
    const { pathname } = useLocation();

    const btnProps = useCallback((itemlink: string) => {
        return ({
            variant: pathname === itemlink ? 'contained' : 'outlined' as 'contained' | 'outlined',
        });
    }, [pathname]);

    return (
        <nav className="p-2 border-b border-b-gray-300 flex flex-row gap-2">
            <Link to="/">
                <Button {...btnProps('/')}>SECS to Item</Button>
            </Link>
            <Link to="/item-to-secs">
                <Button {...btnProps('/item-to-secs')}>Item To Secs</Button>
            </Link>
        </nav>
    );
}

export default Navigation;