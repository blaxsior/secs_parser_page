const itemSMLs =
    ['L', 'B', 'BOOLEAN', 'A',
        // 'J' |
        'I8', 'I1', 'I2', 'I4',
        'F8', 'F4',
        'U8', 'U1', 'U2', 'U4'];

function Secs2ItemComponent({ value, onChange, onRemove, path }: Secs2ItemComponentProps) {
    const { item, type } = value;
    const changeType = (newType: string) => {
        onChange({ ...value, type: newType, item: [] });
    };

    const changeValue = (val: any, idx: number) => {
        const newItem = [...value.item];
        newItem[idx] = val;
        onChange({ ...value, item: newItem });
    };

    const addItem = () => {
        const newItem = value.type === 'L' ? { type: 'L', item: [] } : null;
        onChange({ ...value, item: [...value.item, newItem] });
    };

    const removeItem = () => {
        onChange({ ...value, item: value.item.slice(0, -1) });
    };

    const updateChildItem = (idx: number, newChild: Secs2CompItem) => {
        const newItem = [...value.item];
        newItem[idx] = newChild;
        onChange({ ...value, item: newItem });
    };

    const removeChildItem = (idx: number) => {
        const newItem = value.item.filter((_, i) => i !== idx);
        onChange({ ...value, item: newItem });
    };
    return (
        <div className="px-4">
            <span className="inline-flex flex-row items-center gap-1">
                <span>&lt;</span>
                <select onChange={(e) => changeType(e.target.value)}>
                    {itemSMLs.map(it => (
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
                    path.length > 0 &&
                    <button
                        className="border border-red-400 bg-red-300 w-[1.5rem] rounded-md active:bg-red-400"
                        onClick={onRemove}>x</button>
                }
            </span>
            {type === 'L' && item.length > 0 &&
                <span className="flex flex-col">
                    {value.item.map((child, idx) => (
                        <Secs2ItemComponent
                            key={idx}
                            value={child as Secs2CompItem}
                            onChange={(newChild) => updateChildItem(idx, newChild)}
                            onRemove={() => removeChildItem(idx)}
                            path={[...path, idx]}
                        />
                    ))}
                </span>
            }
            <span>&gt;</span>
        </div>
    );
}

export default Secs2ItemComponent;