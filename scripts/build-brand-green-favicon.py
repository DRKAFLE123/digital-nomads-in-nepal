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
  <!-- Brand Alpine Pine Circular Badge (Option 2) -->
  <circle cx="256" cy="256" r="248" fill="#023629" />
  
  <!-- Centered Snow White Mountain & Vibrant Warm Amber Wi-Fi -->
  <g transform="translate(43.3, 160.25) scale(0.5496)">
    <path fill="#FFFFFF" d="{mountain_d}" />
    <path fill="#FB923C" d="{wifi_d}" />
  </g>
</svg>
'''
    with open('public/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    with open('public/branding/favicon.svg', 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("Option 2 SVG favicons generated successfully")

def generate_rasters():
    white_mark = Image.open('public/branding/logo-mark-white.png').convert('RGBA')
    bbox = white_mark.getbbox()
    trimmed = white_mark.crop(bbox)
    tw, th = trimmed.size

    def create_green_badge(size, is_squircle=False):
        canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
        draw = ImageDraw.Draw(canvas)
        pad = max(1, int(size * 0.02))
        r = size - pad * 2
        
        # Alpine Pine Fill (#023629)
        pine_color = (2, 54, 41, 255)
        if is_squircle:
            draw.rounded_rectangle((pad, pad, pad + r - 1, pad + r - 1), radius=int(size * 0.22), fill=pine_color)
        else:
            draw.ellipse((pad, pad, pad + r - 1, pad + r - 1), fill=pine_color)
            
        target_w = int(r * 0.82)
        target_h = int(target_w * (th / tw))
        scaled = trimmed.resize((target_w, target_h), Image.Resampling.LANCZOS)
        
        pos_x = (size - target_w) // 2
        pos_y = (size - target_h) // 2 + max(0, int(size * 0.015))
        canvas.alpha_composite(scaled, (pos_x, pos_y))
        return canvas

    sizes = {
        'favicon-16x16.png': (16, False),
        'favicon-32x32.png': (32, False),
        'apple-icon.png': (180, True),
        'icon-192.png': (192, False),
        'icon-512.png': (512, False),
        'webapp-installed-icon.png': (512, True),
        'faviconlogo.png': (512, False),
        'faviconnew.png': (192, False),
    }

    for filename, (sz, squircle) in sizes.items():
        img = create_green_badge(sz, is_squircle=squircle)
        img.save(os.path.join('public', filename), 'PNG')
        img.save(os.path.join('public/branding', filename), 'PNG')

    # Multi-size favicon.ico
    img16 = create_green_badge(16, False)
    img32 = create_green_badge(32, False)
    img48 = create_green_badge(48, False)
    
    img16.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[img32, img48])
    img16.save('public/branding/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)], append_images=[img32, img48])
    print("Option 2 Raster PNGs and ICO generated successfully")

if __name__ == '__main__':
    generate_svg()
    generate_rasters()
