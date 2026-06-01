import { categoryOptions, conditionLabels, exchangeTypeLabels } from "../../utils/bookLabels.js";

export { categoryOptions };

export const conditionOptions = [
  { value: "new", label: conditionLabels.new },
  { value: "good", label: conditionLabels.good },
  { value: "fair", label: conditionLabels.fair },
  { value: "worn", label: conditionLabels.worn },
];

export const exchangeTypeOptions = [
  { value: "permanent", label: exchangeTypeLabels.permanent },
  { value: "lending", label: exchangeTypeLabels.lending },
  { value: "both", label: exchangeTypeLabels.both },
];
