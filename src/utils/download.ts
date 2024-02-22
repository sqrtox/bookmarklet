import { URL$, createElement$ } from "@/utils/$.js";

export const downloadFile = (fileName: string, blob: Blob): void => {
  const a = createElement$("a");
  const href = URL$.createObjectURL(blob);

  a.href = href;
  a.download = fileName;

  a.click();
  URL$.revokeObjectURL(href);
};
