import { querySelector$ } from "@/utils/$.js";
import { downloadFile } from "@/utils/download.js";
import { sha256Blob } from "@/utils/hash.js";

(async () => {
  const { hostname, pathname } = location;

  if (
    !/^www\.youtube\.com$/.test(hostname) ||
    !/\/?@.+/.test(pathname) && !/^\/?channel\/.+/.test(pathname)
  ) {
    return;
  }

  const channelHandle = querySelector$("#channel-handle")?.textContent?.slice(1);
  const channelId = (querySelector$("[rel=canonical]") as HTMLLinkElement | null)?.href.replace(/^.+\/channel\//, "");
  const avatarSource = (querySelector$("#avatar #img") as HTMLImageElement | null)?.src;
  const avatarSize = avatarSource?.match(/=(s\d+)/)?.[1];

  if (!channelHandle || !channelId || !avatarSource || !avatarSize) {
    return;
  }

  const download = async (type: "banner" | "avatar", size: string, source: string): Promise<void> => {
    const response = await fetch(source);
    const blob = await response.blob();
    const fileExtension = blob.type.split("/")[1];
    const hash = await sha256Blob(blob);

    downloadFile(`${channelId}_${type}_${size}_${hash.slice(0, 32)}_${channelHandle}.${fileExtension}`, blob);
  };

  await download("avatar", avatarSize, avatarSource);

  const bannerElement = querySelector$(".page-header-banner-image") as HTMLDivElement | null;

  if (bannerElement) {
    const bannerElementStyle = getComputedStyle(bannerElement);
    const bannerSource = bannerElementStyle.getPropertyValue("--yt-channel-banner").replace(/^url\(|\)$/g, "");
    const bannerSize = bannerSource.match(/=(w\d+)/)?.[1];

    if (bannerSize) {
      await download("banner", bannerSize, bannerSource);
    }
  }
})();
