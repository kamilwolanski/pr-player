const DEV_CMS_GATEWAY_URL = "https://dev-cms-gateway.polskieradio.pl/cms/dev";
const PUBLIC_CMS_CDN_URL = "https://cdn6.polskieradio.pl/cms/dev";

export function rewriteCmsMediaUrlToCdn(uri: string) {
  return uri
    .replace(DEV_CMS_GATEWAY_URL, PUBLIC_CMS_CDN_URL)
    .replace(/\.wav$/, ".mp3");
}
