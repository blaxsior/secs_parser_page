import { ItemEnum } from "@/core/secs/const";
import { validateFloat, validateInt } from "@/core/util/validator";

export const itemValidator = (key: string) => {
    const floatKeys: string[] = [ItemEnum.F4, ItemEnum.F8];
    if(floatKeys.includes(key)) return validateFloat;
    return validateInt;
};