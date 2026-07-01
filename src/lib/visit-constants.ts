export type InputMethod = "quick" | "manual" | "business_card";

export const VISIT_PLACEHOLDER = {
  NOT_ENTERED: "未入力",
  BUSINESS_CARD: "名刺確認",
} as const;

export const INPUT_METHODS: InputMethod[] = ["quick", "manual", "business_card"];
