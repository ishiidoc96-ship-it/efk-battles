from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

src = Path('public/sponsors/efk-logo.png')
img = Image.open(src).convert('RGB')
out = Path('public/icons')
out.mkdir(parents=True, exist_ok=True)

def resize_square(im, size, pad_ratio=0.0):
    if pad_ratio > 0:
        bg = Image.new('RGB', (size, size), (10, 10, 10))
        inner = int(size * (1 - pad_ratio * 2))
        logo = im.resize((inner, inner), Image.Resampling.LANCZOS)
        off = (size - inner) // 2
        bg.paste(logo, (off, off))
        return bg
    return im.resize((size, size), Image.Resampling.LANCZOS)

resize_square(img, 192).save(out / 'icon-192.png', optimize=True)
resize_square(img, 512).save(out / 'icon-512.png', optimize=True)
resize_square(img, 192, pad_ratio=0.18).save(out / 'icon-192-maskable.png', optimize=True)
resize_square(img, 512, pad_ratio=0.18).save(out / 'icon-512-maskable.png', optimize=True)
resize_square(img, 180, pad_ratio=0.08).save(out / 'apple-touch-icon.png', optimize=True)
resize_square(img, 32).save(out / 'favicon-32.png', optimize=True)

og = Image.new('RGB', (1200, 630), (10, 10, 10))
logo = img.resize((420, 420), Image.Resampling.LANCZOS)
og.paste(logo, ((1200 - 420) // 2, (630 - 420) // 2))
og.save(out / 'og-cover.png', optimize=True)

# Also copy favicon for Next app
resize_square(img, 32).save('app/icon.png', optimize=True)

print('icons done')
for p in sorted(out.iterdir()):
    print(p, p.stat().st_size)
