declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
  Pushes a custom event object into the Google Tag Manager dataLayer.
 */
export const sendGTMEvent = (data: Record<string, unknown>): void => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  }
};

/**
  Tracks outbound partner link clicks (e.g. Wolf Offices, hosteling, local cafes).
  Event: outbound_partner_click
  Parameter: click_url
 */
export const trackOutboundClick = (clickUrl: string): void => {
  sendGTMEvent({
    event: "outbound_partner_click",
    click_url: clickUrl,
  });
};

/**
  Tracks deep reading engagement when user reaches 90% scroll depth on articles/guides.
  Event: deep_article_read
  Parameter: page_path
 */
export const trackScrollDepth = (pagePath: string): void => {
  sendGTMEvent({
    event: "deep_article_read",
    page_path: pagePath,
  });
};

/**
  Tracks lead generation conversions (newsletter signups, contact forms, guide requests).
  Event: generate_lead
  Parameter: form_id
 */
export const trackLeadGeneration = (formId: string): void => {
  sendGTMEvent({
    event: "generate_lead",
    form_id: formId,
  });
};

/**
  Tracks downloads of lead magnet guides (.pdf, .epub).
  Event: download_guide
  Parameter: file_name
 */
export const trackGuideDownload = (fileName: string): void => {
  sendGTMEvent({
    event: "download_guide",
    file_name: fileName,
  });
};
