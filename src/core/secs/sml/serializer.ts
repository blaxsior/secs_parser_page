import { numToHexStr } from "@/core/util/convert";
import { Secs2Item } from "../item/type";

/**
 * SecsItem을 SML 문자열로 변환해주는 클래스    
 */
class SecsItemToSMLSerializer {
    serialize(item: Secs2Item, depth: number = 0): string {
        const sml = item.info.sml;
        const data = item.data;

        let str = `${this.tab(depth)}<${sml}`;

        if (data.length === 0) {
            str += '>';
        } else if (sml === 'L') {
            str += ` [${item.data.length}]`;
            for (const child of (data as Secs2Item[])) {
                str += `\n${this.serialize(child, depth + 1)}`;
            }
            str += `\n${this.tab(depth)}>`;
        } else if (sml === 'A') {
            str += ` "${data}">`;
        }
        else {
            if (data.length > 1) str += ` [${item.data.length}]`;
            if (sml === 'B') str += ` ${(data as number[]).map(it => '0x'+numToHexStr(it)).join(" ")}>`;
            else str += ` ${(data as any[]).join(" ")}>`;
        }

        // 종료 표시
        if (depth === 0) str += '\t.';

        return str;
    }

    private tab(depth: number) {
        return '\t'.repeat(depth);
    }
}

export {
    SecsItemToSMLSerializer
}