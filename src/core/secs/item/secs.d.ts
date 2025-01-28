// // https://www.peergroup.com/resources/secs-message-language/
// // SML info

export type Secs2ItemSML = 'L' | 'B' | 'BOOLEAN' | 'A' | 'J' |
    'I8' | 'I1' | 'I2' | 'I4' |
    'F8' | 'F1' | 'F2' | 'F4' |
    'U8' | 'U1' | 'U2' | 'U4';

type Secs2ItemMap<T extends Secs2ItemSML> =
    T extends 'L' ? Secs2Item[] :  // List
    T extends 'B' ? Uint8Array :
    T extends 'BOOLEAN' ? boolean[] :
    T extends 'A' ? string :
    T extends
    'J' | 'I8' | 'I1' | 'I2' | 'I4' |
    'F8' | 'F1' | 'F2' | 'F4' |
    'U8' | 'U1' | 'U2' | 'U4' ? number[] :
    never;
/**
 * SECS-II의 각 아이템 타입
 */
export type Secs2ItemType<T> = {
    sml: T,
    format: string,
    formatCode: number
};
// Secs2ItemMap[T];

export type Secs2Item = {
    [K in Secs2ItemSML]: {
        type: K;
        name?: string;
        length: number;
        items: Secs2ItemMap<K>;
    };
}[Secs2ItemSML];