import { useState } from "react";
import Secs2ItemComponent from "./Secs2ItemComponent";
import { Secs2CompItem } from "@/core/secs/item/type";

function Secs2ItemEditor() {
    const [rootItem, setRootItem] = useState<Secs2CompItem>({ type: 'L', data: [] });
    
    return (
        <Secs2ItemComponent
            value={rootItem}
            onChange={(newValue) => setRootItem(newValue)}
            onRemove={() => {}}
        />
    );
}

export default Secs2ItemEditor