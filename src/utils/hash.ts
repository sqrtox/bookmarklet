import { window__crypto__subtle$ } from "@/utils/$.js";

export const sha256 = async (data: BufferSource): Promise<string> => [...new Uint8Array(await window__crypto__subtle$.digest("SHA-256", data))].map(n => n.toString(16).padStart(2, "0")).join("");

export const sha256Blob = async (blob: Blob): Promise<string> => sha256(await blob.arrayBuffer());
