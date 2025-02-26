import { validateFloat, validateInt } from "@/core/util/validator";
import { Secs2ItemDataType, Secs2ItemSML } from "../../item/type";

export class Secs2CompItemDataParser {
    private parseMap: Map<Secs2ItemSML, (item: string[]) => Secs2ItemDataType>;

    constructor() {
        this.parseMap = new Map();
        this.parseMap.set('A', this.parseString);
        
        this.parseMap.set('I8', this.parseBigint);
        this.parseMap.set('U8', this.parseBigint);

        this.parseMap.set('F4', this.parseFloat);
        this.parseMap.set('F8', this.parseFloat);
    }

    parse<T extends Secs2ItemSML>(key: T, data: string[]): Secs2ItemDataType<T> {
        let parseFunc = this.parseMap.get(key) ?? this.parseInt;
        return parseFunc(data);
    }

    parseBigint(item: string[]): bigint[] {
        const items: bigint[] = [];
        for (const data of item) {
            if(!validateInt(data)) throw new Error(`${data} is not integer`);
            items.push(BigInt(data));
        }
        return items;
    }

    private parseInt(item: string[]): number[] {
        const items: number[] = [];
        for (const data of item) {
            if(!validateInt(data)) throw new Error(`${data} is not integer`);
            items.push(parseInt(data));
        }
        return items;
    }

    private parseFloat(item: string[]): number[] {
        const items: number[] = [];
        for (const data of item) {
            if(!validateFloat(data)) throw new Error(`${data} is not float`);
            items.push(parseFloat(data));
        }
        return items;
    }
    
    private parseString(item: string[]): string {
        return item.join(''); // 띄어서 표현 가능하나 붙어 있는 것으로 간주.
    }
}