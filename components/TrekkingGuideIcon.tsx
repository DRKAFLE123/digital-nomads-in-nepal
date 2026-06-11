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
      {/* Green rounded base / grass */}
      <path
        d="M6 54C20 49 44 49 58 54"
        stroke="#2e7d32"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M10 53C22 49 42 49 54 53"
        stroke="#4caf50"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Mountain body (earthy brown/tan) */}
      <path
        d="M12 50L32 14L52 50H12Z"
        fill="#a1887f"
        stroke="#5d4037"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      
      {/* Snow cap (pristine white with stylized peaks) */}
      <path
        d="M25 26.5L32 14L39 26.5L35.5 23.5L32 28L28.5 23.5L25 26.5Z"
        fill="#ffffff"
        stroke="#cfd8dc"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      
      {/* Secondary accent mountain shadow/detail */}
      <path
        d="M32 14V50"
        stroke="#8d6e63"
        strokeWidth="2.5"
        strokeDasharray="4 4"
      />
    </svg>
  )
}
