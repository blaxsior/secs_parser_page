import { Secs2ItemInfo } from "./secs";

const secsItemInfoList: Secs2ItemInfo[] = [
    { sml: 'L', formatCode: 0o00 },
    { sml: 'B', formatCode: 0o10 },
    { sml: 'BOOLEAN', formatCode: 0o11 },
    { sml: 'A', formatCode: 0o20 },
    { sml: 'I8', formatCode: 0o30 },
    { sml: 'I1', formatCode: 0o31 },
    { sml: 'I2', formatCode: 0o32 },
    { sml: 'I4', formatCode: 0o34 },
    { sml: 'F8', formatCode: 0o40 },
    { sml: 'F4', formatCode: 0o44 },
    { sml: 'U8', formatCode: 0o50 },
    { sml: 'U1', formatCode: 0o51 },
    { sml: 'U2', formatCode: 0o52 },
    { sml: 'U4', formatCode: 0o54 },
] as const; // 나중에 필요하면 다른 폴더로 이동

class Secs2ItemInfoMap {
    private smlToInfo: Map<string, Secs2ItemInfo>;
    private formatCodeToInfo: Map<number, Secs2ItemInfo>;
    private itemList: Secs2ItemInfo[];

    constructor(itemList: Secs2ItemInfo[]) {
        this.smlToInfo = new Map();
        this.formatCodeToInfo = new Map();
        this.itemList = structuredClone(itemList);

        this.itemList.forEach(it => {
            Object.freeze(it);
            this.smlToInfo.set(it.sml, it);
            this.formatCodeToInfo.set(it.formatCode, it);
        });
    }

    fromSML(sml: string) {
        const result = this.smlToInfo.get(sml);
        if(result === undefined) throw new Error(`no secs-II type matched to sml ${sml}`);
        return result;
    }

    fromFormatCode(formatCode: number) {
        const result =  this.formatCodeToInfo.get(formatCode);
        if(result === undefined) throw new Error(`no secs-II type matched to format code ${formatCode}`);
        return result;
    }
}

const secsInfoMap = new Secs2ItemInfoMap(secsItemInfoList);

export {
    Secs2ItemInfoMap,
    secsInfoMap
};