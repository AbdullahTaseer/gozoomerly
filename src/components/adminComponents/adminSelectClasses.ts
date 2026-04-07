/**
 * Pass to `SelectItem` className in admin only. Overrides the shared shadcn
 * gradient (other app areas keep the default SelectItem styling).
 */
export const adminSelectItemClassName =
  "data-[highlighted]:bg-gradient-to-r data-[highlighted]:from-black data-[highlighted]:to-black data-[highlighted]:text-white " +
  "focus:bg-gradient-to-r focus:from-black focus:to-black focus:text-white " +
  "data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-black data-[state=checked]:to-black data-[state=checked]:text-white";
