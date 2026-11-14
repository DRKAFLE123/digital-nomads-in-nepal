import os
import re
from PIL import Image, ImageDraw

def generate_svg():
    with open('public/branding/logo-mark.svg', 'r', encoding='utf-8') as f:
        text = f.read()

    paths = re.findall(r'<path[^>]+d="([^"]+)"', text)
    if len(paths) >= 2:
        mountain_d = paths[0]
        wifi_d = paths[1]
    else:
        raise ValueError("Could not find both paths in logo-mark.svg")

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!-- Airbnb / Booking.com Style Brand Squircle (Alpine Pine #023629) -->
  <rect width="512" height="512" rx="112" fill="#023629" />
  
  <!-- Snow White Mountain & Vibrant Warm Terracotta Wi-Fi -->
  <g transform="translate(56.5, 168) scale(0.535)">
    <path fill="#FFFFFF" d="{mountain_d}" />
    <path fill="#FB923C" d="{wifi_d}" />
  </g>
</svg>
'''
    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    with open('public/branding/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("Airbnb/Booking-style SVG favicons generated successfully")

def generate_rasters():
    white_mark = Image.open('public/branding/logo-mark-white.png').convert('RGBA')
    bbox = white_mark.getbbox()
    trimmed = white_mark.crop(bbox)
    tw, th = trimmed.size

    def create_squircle_icon(size):
        canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(canvas)
        radius = max(2, int(size * 0.22))
        
        # Alpine Pine Brand Color (#023629)
        draw.rounded_rectangle((0, 0, size - 1, size - 1), radius=radius, fill=(2, 54, 41, 255))
            
        target_w = int(size * 0.80)
        target_h = int(target_w * (th / tw))
        scaled = trimmed.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        pos_x = (size - target_w) // 2
        pos_y = (size - target_h) // 2 + max(0, int(size * 0.02))
        canvas.alpha_composite(scaled, (pos_x, pos_y))
        return canvas

    sizes = {
        'favicon-16x16.png': 16,
        'favicon-32x32.png': 32,
        'apple-icon.png': 180,
        'icon-192.png': 192,
        'icon-512.png': 512,
        'webapp-installed-icon.png': 512,
        'faviconlogo.png': 512,
        'faviconnew.png': 192,
    }

    for filename, sz in sizes.items():
        img = create_squircle_icon(sz)
        img.save(os.path.join('public', filename), 'PNG')
        img.save(os.path.join('public/branding', filename), 'PNG')

    # Multi-size favicon.ico
    img16 = create_squircle_icon(16)
    img32 = create_squircle_icon(32)
    img48 = create_squircle_icon(48)
    
    img16.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[img32, img48])
    img16.save('public/branding/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[img32, img48])
    print("Airbnb/Booking-style Raster PNGs and ICO generated successfully")

if __name__ == '__main__':
    generate_svg()
    generate_rasters()
