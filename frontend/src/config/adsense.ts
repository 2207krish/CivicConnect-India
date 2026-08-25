export const adsenseConfig = {
  client: process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "",
  slots: {
    homeTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_TOP?.trim() || "",
    homeMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID?.trim() || "",
    homeBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_BOTTOM?.trim() || "",
    dashboard: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DASHBOARD?.trim() || "",
    directory: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DIRECTORY?.trim() || "",
    download: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DOWNLOAD?.trim() || "",
    contact: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTACT?.trim() || "",
    complaint: process.env.NEXT_PUBLIC_ADSENSE_SLOT_COMPLAINT?.trim() || "",
    learnIndex: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEARN_INDEX?.trim() || "",
    learnArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEARN_ARTICLE?.trim() || "",
  },
};

export function adsenseReady() {
  return Boolean(adsenseConfig.client.startsWith("ca-pub-"));
}
