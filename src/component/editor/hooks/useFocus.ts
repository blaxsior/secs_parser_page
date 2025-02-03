import React, { useState } from "react";

function useFocus(target: React.RefObject<HTMLElement>) {
    const [isFocused, setFocus] = useState(false);

    const clickSelfHandler = () => {
        target.current?.focus();
    }

    const focusSelfHandler = () => {
        setFocus(true);
    }

    const blurSelfHandler = () => {
        setFocus(false);
    }

    return {
        isFocused,
        click: clickSelfHandler,
        focus: focusSelfHandler,
        blur: blurSelfHandler,
    }
}

export {
    useFocus
}