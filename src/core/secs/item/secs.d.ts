// // https://www.peergroup.com/resources/secs-message-language/
// // SML info

import { BufferReader } from "../../util/BufferReader";

export type Secs2ItemSML = 'L' | 'B' | 'BOOLEAN' | 'A' | 
    // 'J' |
    'I8' | 'I1' | 'I2' | 'I4' |
    'F8' | 'F4' |
    'U8' | 'U1' | 'U2' | 'U4';

type Secs2ItemDataType<T extends Secs2ItemSML> =
    T extends 'L' ? Secs2Item[] :
    T extends 'B' ? number[] :
    T extends 'BOOLEAN' ? boolean[] :
    T extends 'A' ? string:
    T extends
    // 'J' | 
    'I1' | 'I2' | 'I4' |
    'F8' | 'F4' |
    'U1' | 'U2' | 'U4' ? number[] :
    T extends 'I8' | 'U8' ? bigint[] :
    never;
/**
 * SECS-II의 각 아이템 타입
 */
export type Secs2ItemInfo<T extends Secs2ItemSML = any> = {
    sml: T,
    formatCode: number,
    itemByteSize?: number
};

export type Secs2Item = {
    [K in Secs2ItemSML]: {
        info: Secs2ItemInfo<K>;
        name?: string;
        data?: Secs2ItemDataType<K>;
    };
}[Secs2ItemSML];