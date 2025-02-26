import { Secs2ItemInfoMap } from "../item/secs_item_info";
import { Secs2CompItem, Secs2Item, Secs2ItemDataType } from "../item/type";
import { Secs2CompItemDataParser } from "./util/comp_data_parser";


export class Secs2CompItemConverter {
    private itemMap: Secs2ItemInfoMap;
    private parser: Secs2CompItemDataParser;

    constructor(itemMap: Secs2ItemInfoMap) {
        this.itemMap = itemMap;
        this.parser = new Secs2CompItemDataParser();
    }

    convert(item: Secs2CompItem): Secs2Item {
        const info = this.itemMap.fromSML(item.type);

        let resultData: Secs2ItemDataType;

        if(item.type === 'L') {
            resultData = [] as Secs2Item[];

            for(const it of item.data) {
                resultData.push(this.convert(it as Secs2CompItem));
            }
        } else {
            resultData = this.parser.parse(
                item.type, 
                item.data.filter(it => it !== null) as string[]
            );
        }

        const result: Secs2Item = {
            info: info,
            data: resultData
        };

        return result;
    }

}