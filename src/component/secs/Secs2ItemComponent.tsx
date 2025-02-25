import { ItemSMLS } from "@/core/secs/const";
import { itemValidator as validate } from "./util";
import type { Secs2CompData, Secs2CompItem, Secs2ItemSML } from "@/core/secs/item/type";

type Secs2ItemComponentProps = {
    value: Secs2CompItem;
    onChange: (newValue: Secs2CompItem) => void;
    onRemove: () => void;
    root?: boolean;
}
function Secs2ItemComponent({ value, onChange, onRemove, root }: Secs2ItemComponentProps) {
    const { data: item, type } = value;
    const changeType = (newType: Secs2ItemSML) => {
        onChange({ ...value, type: newType, data: [] });
    };

    const changeValue = (val: string, idx: number) => {
        if (val && !validate(type)(val)) return;

        const newItem = [...value.data] as (string | null)[];
        newItem[idx] = val;
        onChange({ ...value, data: newItem });
    };

    const addItem = () => {
        const newItem: Secs2CompData = value.type === 'L' ?
            { type: 'L', data: [] }
            : null;
        onChange({ ...value, data: [...value.data, newItem] });
    };

    const removeItem = () => {
        onChange({ ...value, data: value.data.slice(0, -1) });
    };

    const updateChildItem = (idx: number, newChild: Secs2CompItem) => {
        const newItem = [...value.data];
        newItem[idx] = newChild;
        onChange({ ...value, data: newItem });
    };

    const removeChildItem = (idx: number) => {
        const newItem = value.data.filter((_, i) => i !== idx);
        onChange({ ...value, data: newItem });
    };
    return (
        <div className="px-4 text-lg">
            <span className="inline-flex flex-row items-center gap-1">
                <span>&lt;</span>
                <select onChange={(e) => changeType(e.target.value as Secs2ItemSML)}>
                    {ItemSMLS.map(it => (
                        <option key={it} value={it}>{it}</option>
                    ))}
                </select>
                <span>[{item.length}]</span>
                {type !== 'L' &&
                    item.map((it, idx) => (
                        <input
                            className="border min-w-[2rem]"
                            key={idx}
                            value={it as string ?? ''}
                            onChange={e => changeValue(e.target.value, idx)}
                            style={{
                                width: `${((it as string)?.length || 1) * 0.6}rem`
                            }}
                        />
                    ))
                }
                <button
                    className="border border-blue-300 w-[1.5rem] rounded-md active:bg-blue-200"
                    onClick={addItem}>+</button>
                <button
                    className="border border-red-400 w-[1.5rem] rounded-md active:bg-red-300"
                    onClick={removeItem}>-</button>
                {
                    !root &&
                    <button
                        className="border border-red-400 bg-red-300 w-[1.5rem] rounded-md active:bg-red-400"
                        onClick={onRemove}>x</button>
                }
            </span>
            {type === 'L' && item.length > 0 &&
                <span className="flex flex-col">
                    {value.data.map((child, idx) => (
                        <Secs2ItemComponent
                            key={idx}
                            value={child as Secs2CompItem}
                            onChange={(newChild) => updateChildItem(idx, newChild)}
                            onRemove={() => removeChildItem(idx)}
                        />
                    ))}
                </span>
            }
            <span>&gt;</span>
        </div>
    );
}

export default Secs2ItemComponent;