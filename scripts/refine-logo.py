import numpy as np
from PIL import Image, ImageFilter

def refine_logo():
    web = Image.open('public/webistepnglogo.png').convert('RGBA')
    nobg = Image.open('public/nobglogo.png').convert('RGBA')
    w, h = web.size
    arr_web = np.array(web)

    # 1. Generate pristine sun circle at 4x resolution for subpixel antialiasing
    scale = 4
    W, H = w * scale, h * scale
    cx, cy, r = 603.16 * scale, 154.83 * scale, 140.14 * scale

    Y, X = np.ogrid[:H, :W]
    dist = np.sqrt((X - cx)**2 + (Y - cy)**2)
    alpha_sun = np.clip((r + 0.5 - dist), 0.0, 1.0)

    # Gradient: top (cy - r) to bottom (cy + r)
    t = np.clip((Y - (cy - r)) / (2 * r), 0.0, 1.0)
    r_grad = 254.0 * np.ones_like(t)
    g_grad = 212.0 * (1.0 - t)**1.15 + 130.0 * (t)**1.15
    b_grad = 10.0 * (1.0 - t) + 20.0 * t

    sun_hi = np.zeros((H, W, 4), dtype=np.float32)
    sun_hi[:, :, 0] = r_grad
    sun_hi[:, :, 1] = g_grad
    sun_hi[:, :, 2] = b_grad
    sun_hi[:, :, 3] = alpha_sun * 255.0

    sun_img = Image.fromarray(sun_hi.astype(np.uint8)).resize((w, h), Image.Resampling.LANCZOS)
    sun_arr = np.array(sun_img)

    # 2. Extract foreground from webistepnglogo.png
    # Foreground elements:
    # A. Nomad, rocks, trees, pagoda: dark navy (arr_web[..., 0] < 50, arr_web[..., 1] < 70, arr_web[..., 2] < 120, A > 80)
    # B. River: arr_web[..., 0] < 120, arr_web[..., 1] > 140, arr_web[..., 2] > 220 at y > 280
    # C. Pin: arr_web[..., 0] > 200, arr_web[..., 1] > 150, arr_web[..., 2] < 50 at y > 350
    # D. Blue mountain body: arr_web[..., 2] > 160, arr_web[..., 0] < 180, A > 80
    # E. Authentic snow: white pixels in the mountain body
    
    # Notice: In webistepnglogo, the mountain ridge from x:465 to 540 had a flat shelf cut at y=120.
    # In nobglogo, the mountain has the authentic ridge and snow!
    # Let's align the mountain ridge from nobglogo to web:
    # dx = 523 - 365 = 158, dy = 40 - 58 = -18
    # In nobg: peak is at (523, 40). In web: peak is at (365, 58).
    # Let's crop the ridge from nobg and place it onto the mountain layer!
    
    # Start with a base composite:
    # Base layer is the pristine sun
    composite = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    composite.paste(sun_img, (0, 0), sun_img)
    
    # Now build the foreground layer:
    # Everything that is NOT sun or background in webistepnglogo
    # Any pixel in arr_web where dist from sun center > r is definitely foreground (or transparent)
    cx_orig, cy_orig, r_orig = 603.16, 154.83, 140.14
    Y_orig, X_orig = np.ogrid[:h, :w]
    dist_orig = np.sqrt((X_orig - cx_orig)**2 + (Y_orig - cy_orig)**2)
    
    # Identify sun pixels in current web logo:
    # Yellow/orange pixels:
    is_web_sun = (arr_web[:, :, 3] > 50) & (arr_web[:, :, 0] > 200) & (arr_web[:, :, 1] > 100) & (arr_web[:, :, 2] < 70) & (dist_orig <= r_orig + 2)
    
    # White artifacts inside sun that were accidentally painted (above y=140 on the left, or flat at y=120):
    is_sun_cut_artifact = (dist_orig <= r_orig - 1) & (arr_web[:, :, 0] > 230) & (arr_web[:, :, 1] > 230) & (arr_web[:, :, 2] > 230) & (Y_orig < 145) & (X_orig > 465) & (X_orig < 535)
    
    # Foreground mask: pixels in web logo with alpha > 50, that are NOT sun and NOT the white cut artifact
    fg_mask = (arr_web[:, :, 3] > 50) & (~is_web_sun) & (~is_sun_cut_artifact)
    
    # Create foreground image from web
    fg_arr = arr_web.copy()
    fg_arr[~fg_mask] = [0, 0, 0, 0]
    
    # Now repair the mountain ridge using nobglogo for the natural slope:
    # Align nobg ridge:
    # nobg ridge is from x=620..710 in nobg, which corresponds to x=462..552 in web
    arr_n = np.array(nobg)
    dx = 158
    dy = -18
    
    for xw in range(460, 540):
        xn = xw + dx
        if 0 <= xn < arr_n.shape[1]:
            for yw in range(85, 230):
                yn = yw + dy
                if 0 <= yn < arr_n.shape[0]:
                    pn = arr_n[yn, xn]
                    # if it's mountain rock or snow in nobg:
                    is_rock_or_snow = (pn[3] > 80) and ((pn[2] > 180 and pn[0] < 150) or (pn[0] > 230 and pn[1] > 230 and pn[2] > 230))
                    # And it is below the natural mountain contour:
                    if is_rock_or_snow:
                        # Copy authentic rock/snow pixel into foreground
                        fg_arr[yw, xw] = pn
    
    fg_img = Image.fromarray(fg_arr)
    
    # Composite: Foreground over Sun
    composite.paste(fg_img, (0, 0), fg_img)
    
    # Save preview
    preview_path = 'C:/Users/Dr.Kafle/.gemini/antigravity-ide/brain/60d9f79b-a48e-4c46-87f6-8ed73c6e3a26/refined_logo_preview.png'
    composite.save(preview_path)
    
    # Also save detail crops of old vs new for visual comparison
    old_sun = web.crop((440, 10, 760, 320))
    new_sun = composite.crop((440, 10, 760, 320))
    
    old_sun.save('C:/Users/Dr.Kafle/.gemini/antigravity-ide/brain/60d9f79b-a48e-4c46-87f6-8ed73c6e3a26/compare_old_sun_detail.png')
    new_sun.save('C:/Users/Dr.Kafle/.gemini/antigravity-ide/brain/60d9f79b-a48e-4c46-87f6-8ed73c6e3a26/compare_new_sun_detail.png')
    
    print('Refined logo and comparison images successfully generated!')

if __name__ == '__main__':
    refine_logo()
