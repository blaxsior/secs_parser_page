import { useLinkStore } from "@/store/link";
import React from "react";

type RouteProps = {
    path: string;
    element: React.JSX.Element;
}

function Route({path, element}: RouteProps) {
    const link = useLinkStore(it => it.link);

    if(link !== path) return <></>;
    return element;
}

export default Route;