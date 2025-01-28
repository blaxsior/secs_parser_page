import type { Secs2ItemInfo } from "./secs";

const secsItemInfo: Secs2ItemInfo = {
    L: { sml: 'L', formatCode: 0o00 },
    B: { sml: 'B', formatCode: 0o10 },
    BOOLEAN: { sml: 'BOOLEAN', formatCode: 0o11 },
    A: { sml: 'A', formatCode: 0o20 },
    I8: { sml: 'I8', formatCode: 0o30 },
    I1: { sml: 'I1', formatCode: 0o31 },
    I2: { sml: 'I2', formatCode: 0o32 },
    I4: { sml: 'I4', formatCode: 0o34 },
    F8: { sml: 'F8', formatCode: 0o40 },
    F4: { sml: 'F4', formatCode: 0o44 },
    U8: { sml: 'U8', formatCode: 0o50 },
    U1: { sml: 'U1', formatCode: 0o51 },
    U2: { sml: 'U2', formatCode: 0o52 },
    U4: { sml: 'U4', formatCode: 0o54 },
} as const;

export {
    secsItemInfo
};