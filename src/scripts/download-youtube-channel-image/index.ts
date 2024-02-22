import { querySelector$ } from "@/utils/$.js";
import { downloadFile } from "@/utils/download.js";
import { sha256Blob } from "@/utils/hash.js";

type ImageType = "banner" | "avatar";

(async () => {
  const channelHandle = querySelector$("#channel-handle")!.textContent!.slice(1);
  const channelId = (querySelector$("[rel=canonical]") as HTMLLinkElement).href.replace(/^.+\/channel\//, "");
  const avatarSrc = (querySelector$("#avatar #img") as HTMLImageElement).src;
  const avatarSize = avatarSrc.match(/=(s\d+)/)![1];

  const download = async (type: ImageType, size: string, src: string) => {
    const res = await fetch(src);
    const blob = await res.blob();
    const hash = await sha256Blob(blob);

    console.log(hash)

    downloadFile(`${channelId}_${type}_${size}_${hash.slice(0, 32)}_${channelHandle}`, blob);
  };

  const banner = querySelector$(".page-header-banner-image") as HTMLDivElement | null;

  if (banner) {
    const style = getComputedStyle(banner);
    const src = style.getPropertyValue("--yt-channel-banner").replace(/^url\(|\)$/g, "");
    const size = src.match(/=(w\d+)/)![1];

    await download("banner", size, src);
  }

  await download("avatar", avatarSize, avatarSrc);
})();
