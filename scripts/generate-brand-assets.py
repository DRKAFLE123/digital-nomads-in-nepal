import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

SRC_PATH = r"C:\Users\Dr.Kafle\.gemini\antigravity\brain\507a9075-b766-428b-9989-3ee072fcff99\.user_uploaded\media_1794627340684_d90f59b1.png"
OUT_DIR = r"E:\Projects\DigitalNomadsInNepal\public\branding"
os.makedirs(OUT_DIR, exist_ok=True)

# 1. Load source image
img = Image.open(SRC_PATH).convert("RGBA")
arr = np.array(img)
alpha = arr[:, :, 3]

# Bounding box
bbox = img.getbbox()
min_x, min_y, max_x, max_y = bbox

# Segment masks
# Mountain: dark green (R < 50, G in 20..100)
mountain_mask = (alpha > 80) & (arr[:, :, 0] < 60) & (arr[:, :, 1] > 20) & (arr[:, :, 1] < 120)
# Wifi: terracotta / saffron (R > 130)
wifi_mask = (alpha > 80) & (arr[:, :, 0] > 130)

# Colors
COLOR_ALPINE_PINE = (2, 54, 41)       # #023629 / #1B4332
COLOR_TERRACOTTA = (205, 96, 3)       # #CD6003 / #C58B55
COLOR_WHITE = (255, 255, 255)
COLOR_DARK_TILE = (13, 43, 29)        # #0D2B1D
COLOR_DARK_TEXT = (25, 31, 45)        # #191F2D
COLOR_GOLD_LIGHT = (232, 146, 60)     # #E8923C

# Helper to create recolored RGBA image from masks
def create_recolored(m_color, w_color):
    new_arr = np.zeros_like(arr)
    # Anti-aliased blend
    m_indices = np.where(mountain_mask)
    new_arr[m_indices[0], m_indices[1], :3] = m_color
    new_arr[m_indices[0], m_indices[1], 3] = alpha[m_indices]
    
    w_indices = np.where(wifi_mask)
    new_arr[w_indices[0], w_indices[1], :3] = w_color
    new_arr[w_indices[0], w_indices[1], 3] = alpha[w_indices]
    
    out_img = Image.fromarray(new_arr, "RGBA")
    # Crop to content with padding
    pad = 24
    crop_box = (max(0, min_x - pad), max(0, min_y - pad), min(img.width, max_x + pad), min(img.height, max_y + pad))
    return out_img.crop(crop_box)

# Generate mark variations
mark_standard = create_recolored(COLOR_ALPINE_PINE, COLOR_TERRACOTTA)
mark_standard.save(os.path.join(OUT_DIR, "logo-mark.png"))

mark_white = create_recolored(COLOR_WHITE, COLOR_TERRACOTTA)
mark_white.save(os.path.join(OUT_DIR, "logo-mark-white.png"))

mark_mono_black = create_recolored((0, 0, 0), (0, 0, 0))
mark_mono_black.save(os.path.join(OUT_DIR, "logo-mark-mono-black.png"))

mark_mono_white = create_recolored((255, 255, 255), (255, 255, 255))
mark_mono_white.save(os.path.join(OUT_DIR, "logo-mark-mono-white.png"))

print("✓ Base mark variations saved (standard, white, mono-black, mono-white)")

# 2. App Icon & Favicon Tile (512x512 rounded squircle)
def create_app_icon(size=512, radius=110):
    icon_bg = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(icon_bg)
    draw.rounded_rectangle([0, 0, size, size], radius=radius, fill=COLOR_DARK_TILE)
    
    # Place white mountain + terracotta wifi inside
    inner_mark = create_recolored(COLOR_WHITE, COLOR_TERRACOTTA)
    # Fit mark into 70% of icon width
    target_w = int(size * 0.72)
    ratio = target_w / inner_mark.width
    target_h = int(inner_mark.height * ratio)
    inner_resized = inner_mark.resize((target_w, target_h), Image.Resampling.LANCZOS)
    
    x = (size - target_w) // 2
    # Slight vertical center offset for visual balance
    y = int((size - target_h) * 0.52)
    icon_bg.paste(inner_resized, (x, y), inner_resized)
    return icon_bg

app_icon_512 = create_app_icon(512, 110)
app_icon_512.save(os.path.join(OUT_DIR, "logo-app-icon.png"))
app_icon_512.save(os.path.join(OUT_DIR, "icon-512.png"))

app_icon_192 = create_app_icon(192, 42)
app_icon_192.save(os.path.join(OUT_DIR, "icon-192.png"))

apple_icon = create_app_icon(180, 40)
apple_icon.save(os.path.join(OUT_DIR, "apple-touch-icon.png"))

favicon_32 = create_app_icon(32, 7)
favicon_32.save(os.path.join(OUT_DIR, "favicon-32x32.png"))

favicon_16 = create_app_icon(16, 4)
favicon_16.save(os.path.join(OUT_DIR, "favicon-16x16.png"))

print("✓ App icons & favicons saved (512, 192, 180, 32, 16)")

# 3. Vector Contours & SVG Paths
m_mask_u8 = ((alpha > 80) & (arr[:, :, 0] < 60) & (arr[:, :, 1] > 20) & (arr[:, :, 1] < 120)).astype(np.uint8) * 255
w_mask_u8 = ((alpha > 80) & (arr[:, :, 0] > 130)).astype(np.uint8) * 255

def contour_to_svg_d(mask, offset_x=min_x, offset_y=min_y):
    cnts, hier = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_TC89_KCOS)
    d_list = []
    if hier is None or len(cnts) == 0:
        return ""
    for c in cnts:
        pts = cv2.approxPolyDP(c, 0.7, True)[:, 0, :]
        if len(pts) < 3:
            continue
        p0 = pts[0]
        cmd = f"M {p0[0]-offset_x} {p0[1]-offset_y}"
        for pt in pts[1:]:
            cmd += f" L {pt[0]-offset_x} {pt[1]-offset_y}"
        cmd += " Z"
        d_list.append(cmd)
    return " ".join(d_list)

d_mountain = contour_to_svg_d(m_mask_u8)
d_wifi = contour_to_svg_d(w_mask_u8)
bw = max_x - min_x
bh = max_y - min_y

# SVG 1: Standalone Vector Mark
svg_mark_light = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {bw} {bh}" fill="none">
  <!-- Mountain Peaks -->
  <path d="{d_mountain}" fill="#023629" />
  <!-- Connectivity Wi-Fi Waves -->
  <path d="{d_wifi}" fill="#CD6003" />
</svg>'''
with open(os.path.join(OUT_DIR, "logo-mark.svg"), "w", encoding="utf-8") as f:
    f.write(svg_mark_light)

# SVG 2: Standalone Vector Mark (White Mountain for Dark Mode)
svg_mark_dark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {bw} {bh}" fill="none">
  <!-- Mountain Peaks (White for Dark Mode) -->
  <path d="{d_mountain}" fill="#FFFFFF" />
  <!-- Connectivity Wi-Fi Waves -->
  <path d="{d_wifi}" fill="#CD6003" />
</svg>'''
with open(os.path.join(OUT_DIR, "logo-mark-white.svg"), "w", encoding="utf-8") as f:
    f.write(svg_mark_dark)

# SVG 3: App Icon Squircle
svg_app_icon = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <rect width="512" height="512" rx="112" fill="#0D2B1D" />
  <g transform="translate(72, 140) scale(0.45)">
    <path d="{d_mountain}" fill="#FFFFFF" />
    <path d="{d_wifi}" fill="#CD6003" />
  </g>
</svg>'''
with open(os.path.join(OUT_DIR, "logo-app-icon.svg"), "w", encoding="utf-8") as f:
    f.write(svg_app_icon)

# SVG 4: Primary Horizontal Lockup (Light Mode)
# Width: ~500px, Height: ~120px
svg_horizontal = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 120" fill="none">
  <!-- Brand Icon -->
  <g transform="translate(10, 16) scale(0.20)">
    <path d="{d_mountain}" fill="#023629" />
    <path d="{d_wifi}" fill="#CD6003" />
  </g>
  
  <!-- Subtle Elegant Divider -->
  <line x1="184" y1="28" x2="184" y2="92" stroke="#E2DCD2" stroke-width="2" stroke-linecap="round" />
  
  <!-- Typography -->
  <text x="202" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', Inter, sans-serif" font-size="34" font-weight="800" fill="#023629" letter-spacing="-0.5">Digital Nomads</text>
  <text x="202" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', Inter, sans-serif" font-size="28" font-weight="700" fill="#CD6003" letter-spacing="-0.3">in Nepal</text>
</svg>'''
with open(os.path.join(OUT_DIR, "logo-horizontal.svg"), "w", encoding="utf-8") as f:
    f.write(svg_horizontal)

# SVG 5: Primary Horizontal Lockup (Dark Mode)
svg_horizontal_dark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 120" fill="none">
  <!-- Brand Icon -->
  <g transform="translate(10, 16) scale(0.20)">
    <path d="{d_mountain}" fill="#FFFFFF" />
    <path d="{d_wifi}" fill="#CD6003" />
  </g>
  
  <!-- Subtle Elegant Divider -->
  <line x1="184" y1="28" x2="184" y2="92" stroke="#2D4438" stroke-width="2" stroke-linecap="round" />
  
  <!-- Typography -->
  <text x="202" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', Inter, sans-serif" font-size="34" font-weight="800" fill="#F5F5F0" letter-spacing="-0.5">Digital Nomads</text>
  <text x="202" y="88" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', Inter, sans-serif" font-size="28" font-weight="700" fill="#E8923C" letter-spacing="-0.3">in Nepal</text>
</svg>'''
with open(os.path.join(OUT_DIR, "logo-horizontal-dark.svg"), "w", encoding="utf-8") as f:
    f.write(svg_horizontal_dark)

# SVG 6: Stacked Lockup (Centered)
svg_stacked = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 230" fill="none">
  <!-- Brand Icon Centered -->
  <g transform="translate(50, 15) scale(0.27)">
    <path d="{d_mountain}" fill="#023629" />
    <path d="{d_wifi}" fill="#CD6003" />
  </g>
  
  <!-- Centered Typography -->
  <text x="160" y="160" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', Inter, sans-serif" font-size="26" font-weight="800" fill="#023629" letter-spacing="-0.5">Digital Nomads</text>
  
  <!-- Symmetrical Divider Accent -->
  <line x1="60" y1="190" x2="105" y2="190" stroke="#CD6003" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
  <text x="160" y="196" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', Inter, sans-serif" font-size="20" font-weight="700" fill="#CD6003" letter-spacing="0.2">in Nepal</text>
  <line x1="215" y1="190" x2="260" y2="190" stroke="#CD6003" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
</svg>'''
with open(os.path.join(OUT_DIR, "logo-stacked.svg"), "w", encoding="utf-8") as f:
    f.write(svg_stacked)

# SVG 7: Stacked Lockup (Dark Mode)
svg_stacked_dark = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 230" fill="none">
  <!-- Brand Icon Centered -->
  <g transform="translate(50, 15) scale(0.27)">
    <path d="{d_mountain}" fill="#FFFFFF" />
    <path d="{d_wifi}" fill="#CD6003" />
  </g>
  
  <!-- Centered Typography -->
  <text x="160" y="160" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', Inter, sans-serif" font-size="26" font-weight="800" fill="#F5F5F0" letter-spacing="-0.5">Digital Nomads</text>
  
  <!-- Symmetrical Divider Accent -->
  <line x1="60" y1="190" x2="105" y2="190" stroke="#E8923C" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
  <text x="160" y="196" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', Inter, sans-serif" font-size="20" font-weight="700" fill="#E8923C" letter-spacing="0.2">in Nepal</text>
  <line x1="215" y1="190" x2="260" y2="190" stroke="#E8923C" stroke-width="1.5" stroke-linecap="round" opacity="0.6" />
</svg>'''
with open(os.path.join(OUT_DIR, "logo-stacked-dark.svg"), "w", encoding="utf-8") as f:
    f.write(svg_stacked_dark)

print("✓ All 7 Vector SVG assets generated and saved!")
