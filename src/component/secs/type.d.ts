type Secs2CompItem = {
    type: string;
    item: (Secs2CompItem | string | null)[];
}

type Secs2ItemComponentProps = {
    value: Secs2CompItem;
    onChange: (newValue: Secs2CompItem) => void;
    onRemove: () => void;
    path: number[]; // 현재 아이템의 경로
}