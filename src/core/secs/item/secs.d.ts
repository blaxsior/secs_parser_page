// // https://www.peergroup.com/resources/secs-message-language/
// // SML info

export type Secs2ItemSML = 'L' | 'B' | 'BOOLEAN' | 'A' | 'J' |
    'I8' | 'I1' | 'I2' | 'I4' |
    'F8' | 'F1' | 'F2' | 'F4' |
    'U8' | 'U1' | 'U2' | 'U4';

type Secs2ItemMap = {
    L: Secs2Item[];
    B: Uint8Array;
    BOOLEAN: boolean[];
    A: string;
    J: number;
    I8: number[];
    I1: number[];
    I2: number[];
    I4: number[];
    F8: number[];
    F1: number[];
    F2: number[];
    F4: number[];
    U8: number[];
    U1: number[];
    U2: number[];
    U4: number[];
};

/**
 * SECS-II의 각 아이템 타입
 */
export type Secs2ItemType<T> = {
    sml: T,
    format: string,
    formatCode: number
};
// Secs2ItemMap[T];

export type Secs2Item =
    { type: 'L', name?: string, items: Secs2Item[] } |
    { type: 'B', name?: string, items: number[] } |
    { type: 'BOOLEAN', name?: string, items: boolean[] } |
    { type: 'A', name?: string, items: string } |
    { type: 'I8' | 'I1' | 'I2' | 'I4' |
    'F8' | 'F1' | 'F2' | 'F4' |
    'U8' | 'U1' | 'U2' | 'U4', name?: string, items: number[] };