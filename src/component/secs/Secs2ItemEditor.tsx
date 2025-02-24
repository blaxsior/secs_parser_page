import { useState } from "react";
import Secs2ItemComponent from "./Secs2ItemComponent";

function Secs2ItemEditor() {
    const [rootItem, setRootItem] = useState<Secs2CompItem>({ type: 'L', item: [] });
    
    return (
        <Secs2ItemComponent
            value={rootItem}
            onChange={(newValue) => setRootItem(newValue)}
            onRemove={() => {/* 최상위 항목은 제거할 수 없음 */ }}
            path={[]}
        />
    );
}

export default Secs2ItemEditor