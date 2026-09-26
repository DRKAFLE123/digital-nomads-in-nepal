import React from "react"

interface TrekkingGuideIconProps {
  className?: string
  size?: number
}

export default function TrekkingGuideIcon({ className = "inline-block", size = 24 }: TrekkingGuideIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ verticalAlign: "middle", display: "inline-block" }}
    >
      {/* Mountain Trail Ground Line */}
      <path
        d="M8 56C24 50 40 54 56 46"
        stroke="#22c55e"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Trekker Backpack (Gold Accent) */}
      <rect
        x="18"
        y="22"
        width="11"
        height="18"
        rx="4"
        fill="#eab308"
        stroke="#ca8a04"
        strokeWidth="2"
      />

      {/* Hiker Head with Cap */}
      <circle cx="34" cy="14" r="5.5" fill="currentColor" />
      {/* Cap brim */}
      <path
        d="M31 12H41"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Torso / Body (Leaning forward on trail) */}
      <path
        d="M32 20L28 36L38 38"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Legs (Hiking stride) */}
      {/* Back leg */}
      <path
        d="M28 36L20 48"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Front leg (Bent at knee taking a step up) */}
      <path
        d="M30 36L38 46L44 54"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Trekking Pole / Stick (Held in hand) */}
      <path
        d="M44 26L48 54"
        stroke="#eab308"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Arm holding trekking pole */}
      <path
        d="M31 23L44 26"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
