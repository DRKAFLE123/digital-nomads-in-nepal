"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackOutboundClick, trackGuideDownload, trackScrollDepth } from "@/lib/gtm";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const HasFiredScrollMap = useRef<Set<string>>(new Set());

  useEffect(() => {
    // 1. Global Click Listener for Outbound Links & File Downloads
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || !target.href) return;

      const href = target.href;

      try {
        const url = new URL(href, window.location.origin);
        
        // Track PDF / EPUB Guide Downloads
        if (/\.(pdf|epub)(\?.*)?$/i.test(url.pathname)) {
          const fileName = url.pathname.split("/").pop() || "guide_download";
          trackGuideDownload(fileName);
        }

        // Track Outbound Partner Link Clicks
        const isExternal =
          url.hostname !== window.location.hostname &&
          !url.hostname.includes("digitalnomadsinnepal.com");

        if (isExternal && url.protocol.startsWith("http")) {
          trackOutboundClick(url.href);
        }
      } catch {
        // Ignore invalid URLs
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  useEffect(() => {
    // 2. Scroll Depth Tracker (90% depth on /blog/, /guides/, or /resources/ pages)
    const isEligiblePage =
      pathname.startsWith("/blog") ||
      pathname.startsWith("/guides") ||
      pathname.startsWith("/resources");

    if (!isEligiblePage) return;

    const handleScroll = () => {
      if (HasFiredScrollMap.current.has(pathname)) return;

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      if (docHeight <= 0) return;

      const scrollPercentage = ((scrollTop + windowHeight) / docHeight) * 100;

      if (scrollPercentage >= 90) {
        HasFiredScrollMap.current.add(pathname);
        trackScrollDepth(pathname);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial scroll in case user lands near bottom
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  return null;
}
