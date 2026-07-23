"use client";

import { useState, useEffect } from "react";
import {
  Link as LinkIcon,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Sparkles,
  Share2,
  Zap,
} from "lucide-react";

interface CampaignLink {
  id: string;
  label: string;
  url: string;
  createdAt: string;
}

const PRESET_PATHS = [
  { label: "Home Page", path: "/" },
  { label: "Nomad Visa Guide 2026", path: "/resources/visa" },
  { label: "Cost of Living Guide", path: "/resources/cost-of-living" },
  { label: "Best Coworking Spaces", path: "/resources/coworking" },
  { label: "SIM Cards & Internet", path: "/resources/sim-cards" },
  { label: "Kathmandu Destination", path: "/destinations/kathmandu" },
  { label: "Pokhara Destination", path: "/destinations/pokhara" },
  { label: "Blog Index", path: "/blog" },
  { label: "Custom Path...", path: "custom" },
];

const SOURCE_PRESETS = [
  "newsletter",
  "facebook",
  "instagram",
  "twitter",
  "linkedin",
  "youtube",
  "google",
  "referral",
];

const MEDIUM_PRESETS = [
  "email",
  "social",
  "cpc",
  "bio_link",
  "banner",
  "partner",
  "post",
];

export default function UTMBuilderPage() {
  const [baseUrl] = useState("https://digitalnomadsinnepal.com");
  const [selectedPath, setSelectedPath] = useState("/");
  const [customPath, setCustomPath] = useState("");

  const [utmSource, setUtmSource] = useState("newsletter");
  const [utmMedium, setUtmMedium] = useState("email");
  const [utmCampaign, setUtmCampaign] = useState("spring_nomad_kit_2026");
  const [utmTerm, setUtmTerm] = useState("");
  const [utmContent, setUtmContent] = useState("");

  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<CampaignLink[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dnin_utm_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (generatedUrl: string) => {
    const label = `${utmSource} / ${utmMedium} / ${utmCampaign}`;
    const newEntry: CampaignLink = {
      id: Date.now().toString(),
      label,
      url: generatedUrl,
      createdAt: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        month: "short",
        day: "numeric",
      }),
    };
    const updated = [newEntry, ...history.filter((h) => h.url !== generatedUrl)].slice(0, 15);
    setHistory(updated);
    try {
      localStorage.setItem("dnin_utm_history", JSON.stringify(updated));
    } catch {
      // Ignore storage errors
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("dnin_utm_history");
    } catch {
      // Ignore
    }
  };

  // Build final URL
  const targetPath = selectedPath === "custom" ? customPath : selectedPath;
  let finalUrl = `${baseUrl}${targetPath.startsWith("/") ? "" : "/"}${targetPath}`;

  const queryParams = new URLSearchParams();
  if (utmSource.trim()) queryParams.set("utm_source", utmSource.trim().toLowerCase().replace(/\s+/g, "_"));
  if (utmMedium.trim()) queryParams.set("utm_medium", utmMedium.trim().toLowerCase().replace(/\s+/g, "_"));
  if (utmCampaign.trim()) queryParams.set("utm_campaign", utmCampaign.trim().toLowerCase().replace(/\s+/g, "_"));
  if (utmTerm.trim()) queryParams.set("utm_term", utmTerm.trim().toLowerCase().replace(/\s+/g, "_"));
  if (utmContent.trim()) queryParams.set("utm_content", utmContent.trim().toLowerCase().replace(/\s+/g, "_"));

  const queryString = queryParams.toString();
  if (queryString) {
    finalUrl += (finalUrl.includes("?") ? "&" : "?") + queryString;
  }

  const handleCopy = () => {
    if (!finalUrl) return;
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    saveToHistory(finalUrl);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e1e1e] pb-6">
        <div>
          <div className="flex items-center gap-2 text-[#FFD700] text-xs font-black uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" /> Marketing & Analytics Suite
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            UTM Campaign URL Builder
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Generate custom campaign links with standard GA4 UTM parameters for email blasts, social media ads, and affiliate links.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Target URL */}
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#FFD700]" /> 1. Target Website Path
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Select Destination Preset
              </label>
              <select
                value={selectedPath}
                onChange={(e) => setSelectedPath(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-[#222222] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FFD700] text-sm"
              >
                {PRESET_PATHS.map((preset) => (
                  <option key={preset.path} value={preset.path}>
                    {preset.label} ({preset.path})
                  </option>
                ))}
              </select>
            </div>

            {selectedPath === "custom" && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Custom Relative Path
                </label>
                <input
                  type="text"
                  placeholder="/blog/your-custom-article-slug"
                  value={customPath}
                  onChange={(e) => setCustomPath(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-[#222222] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FFD700] text-sm"
                />
              </div>
            )}
          </div>

          {/* Step 2: Campaign Parameters */}
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FFD700]" /> 2. Campaign Tracking Parameters
            </h2>

            {/* Campaign Source */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Campaign Source (<span className="text-[#FFD700]">utm_source</span>) *
                </label>
                <span className="text-[11px] text-gray-500">e.g. newsletter, google, facebook</span>
              </div>
              <input
                type="text"
                required
                placeholder="newsletter"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-[#222222] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FFD700] text-sm"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-gray-500 self-center mr-1">Presets:</span>
                {SOURCE_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setUtmSource(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      utmSource === preset
                        ? "bg-[#FFD700] text-black border-[#FFD700]"
                        : "bg-[#181818] text-gray-400 border-[#2b2b2b] hover:text-white hover:border-[#FFD700]"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Medium */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Campaign Medium (<span className="text-[#FFD700]">utm_medium</span>) *
                </label>
                <span className="text-[11px] text-gray-500">e.g. email, cpc, social, banner</span>
              </div>
              <input
                type="text"
                required
                placeholder="email"
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-[#222222] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FFD700] text-sm"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-gray-500 self-center mr-1">Presets:</span>
                {MEDIUM_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setUtmMedium(preset)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      utmMedium === preset
                        ? "bg-[#FFD700] text-black border-[#FFD700]"
                        : "bg-[#181818] text-gray-400 border-[#2b2b2b] hover:text-white hover:border-[#FFD700]"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign Name */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Campaign Name (<span className="text-[#FFD700]">utm_campaign</span>) *
                </label>
                <span className="text-[11px] text-gray-500">e.g. spring_nomad_kit_2026</span>
              </div>
              <input
                type="text"
                required
                placeholder="spring_nomad_kit_2026"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                className="w-full bg-[#0b0b0b] border border-[#222222] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#FFD700] text-sm"
              />
            </div>

            {/* Optional Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1e1e1e] pt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Campaign Term (utm_term) <span className="text-gray-600 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="nepal_visa_keywords"
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-[#222222] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#FFD700] text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                  Campaign Content (utm_content) <span className="text-gray-600 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="blue_cta_button"
                  value={utmContent}
                  onChange={(e) => setUtmContent(e.target.value)}
                  className="w-full bg-[#0b0b0b] border border-[#222222] text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#FFD700] text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Generated Result & History Column */}
        <div className="space-y-6">
          {/* Live Generated URL Card */}
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-2xl p-6 shadow-xl space-y-5 sticky top-6">
            <h3 className="text-sm font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
              <Share2 className="w-4 h-4 text-[#FFD700]" /> Live Campaign Link
            </h3>

            <div className="bg-[#070707] border border-[#222222] p-4 rounded-xl break-all font-mono text-xs text-[#FFD700] leading-relaxed select-all">
              {finalUrl}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  copied
                    ? "bg-green-500 text-black shadow-lg shadow-green-500/20"
                    : "bg-[#FFD700] text-black hover:bg-white shadow-lg shadow-yellow-500/10"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy URL
                  </>
                )}
              </button>

              <a
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-[#1e1e1e] hover:bg-[#2e2e2e] text-white rounded-xl flex items-center justify-center transition-colors"
                title="Test Open URL"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Campaign Summary Pills */}
            <div className="border-t border-[#1e1e1e] pt-4 space-y-2 text-xs">
              <div className="text-gray-500 font-semibold uppercase">Captured GA4 Parameters:</div>
              <div className="flex flex-wrap gap-1.5">
                {utmSource && (
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono">
                    source: {utmSource}
                  </span>
                )}
                {utmMedium && (
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono">
                    medium: {utmMedium}
                  </span>
                )}
                {utmCampaign && (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono">
                    campaign: {utmCampaign}
                  </span>
                )}
              </div>
            </div>

            {/* Local History Section */}
            {history.length > 0 && (
              <div className="border-t border-[#1e1e1e] pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Recent Generated Links
                  </span>
                  <button
                    onClick={clearHistory}
                    className="text-gray-500 hover:text-red-400 transition-colors p-1"
                    title="Clear history"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#080808] border border-[#1e1e1e] rounded-xl hover:border-[#FFD700]/40 transition-all text-xs group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-white truncate max-w-[170px]">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-gray-500">{item.createdAt}</span>
                      </div>
                      <div className="text-gray-400 truncate font-mono text-[10px] mb-2">
                        {item.url}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.url);
                        }}
                        className="text-[10px] font-bold text-[#FFD700] hover:underline flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy again
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
