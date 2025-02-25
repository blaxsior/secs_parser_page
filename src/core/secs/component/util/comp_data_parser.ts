import { validateFloat, validateInt } from "@/core/util/validator";
import { Secs2ItemDataType, Secs2ItemSML } from "../../item/type";

export class Secs2CompItemDataParser {
    private parseMap: Map<Secs2ItemSML, (item: string[]) => Secs2ItemDataType>;

    constructor() {
        this.parseMap = new Map();
        this.parseMap.set('A', this.parseString);
        this.parseMap.set('BOOLEAN', this.parseBoolean);
        this.parseMap.set('F4', this.parseFloat);
        this.parseMap.set('F8', this.parseFloat);
    }

    parse<T extends Secs2ItemSML>(key: T, data: string[]): Secs2ItemDataType<T> {
        let parseFunc = this.parseMap.get(key) ?? this.parseInt;
        return parseFunc(data);
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

    private parseBoolean(item: string[]): boolean[] {
        const items: boolean[] = [];
        for (const data of item) {
            if(!validateFloat(data)) throw new Error(`${data} cannot convert to boolean`);
            items.push(parseInt(data) > 0);
        }
        return items;
    }

    private parseString(item: string[]): string {
        return item.join(); // 띄어서 표현 가능하나 붙어 있는 것으로 간주.
    }
}