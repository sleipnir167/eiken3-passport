"""アプリのアイコンを描く：python3 tools/make-icons.py
紺の空に、コーラルの紙飛行機と「3」のパスポートスタンプ
"""
import math
from PIL import Image, ImageDraw, ImageFont

S = 1024  # 高解像度で描いて縮小する


def rounded_bg(img, radius, maskable=False):
    d = ImageDraw.Draw(img)
    # 空のグラデーション
    top, bottom = (79, 163, 227), (29, 52, 97)
    grad = Image.new('RGB', (S, S))
    gd = ImageDraw.Draw(grad)
    for y in range(S):
        t = y / S
        c = tuple(int(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        gd.line([(0, y), (S, y)], fill=c)
    mask = Image.new('L', (S, S), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, S - 1, S - 1], radius=0 if maskable else radius, fill=255)
    img.paste(grad, (0, 0), mask)
    return d


def draw_icon(maskable=False):
    img = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = rounded_bg(img, 220, maskable)
    k = 0.8 if maskable else 1.0  # maskable は中央に寄せる
    cx, cy = S / 2, S / 2

    def P(x, y):
        return (cx + (x - 512) * k, cy + (y - 512) * k)

    # 雲
    for (x, y, r) in [(250, 300, 70), (320, 280, 90), (400, 300, 70), (700, 760, 60), (770, 740, 80), (840, 765, 60)]:
        xx, yy = P(x, y)
        rr = r * k
        d.ellipse([xx - rr, yy - rr * 0.6, xx + rr, yy + rr * 0.6], fill=(255, 255, 255, 70))
    # 点線の飛行ルート
    pts = []
    for i in range(0, 60):
        t = i / 59
        x = 150 + t * 560
        y = 860 - t * 470 - math.sin(t * math.pi) * 110
        pts.append(P(x, y))
    for i in range(0, len(pts) - 1, 2):
        d.line([pts[i], pts[i + 1]], fill=(255, 255, 255, 200), width=int(14 * k))
    # スタンプ（3）
    sx, sy = P(345, 600)
    r = 215 * k
    d.ellipse([sx - r, sy - r, sx + r, sy + r], fill=(255, 197, 61, 255))
    d.ellipse([sx - r * 0.86, sy - r * 0.86, sx + r * 0.86, sy + r * 0.86], outline=(29, 52, 97, 255), width=int(12 * k))
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(270 * k))
        small = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(50 * k))
    except OSError:
        font = ImageFont.load_default()
        small = font
    d.text((sx, sy + 30 * k), '3', font=font, fill=(29, 52, 97, 255), anchor='mm')
    d.text((sx, sy - 122 * k), 'EIKEN', font=small, fill=(29, 52, 97, 255), anchor='mm')
    # 紙飛行機
    plane = [(0, 0), (-300, -110), (-175, 0), (-300, 110)]
    ang = math.radians(-38)
    px, py = P(850, 250)

    def rot(p):
        x, y = p
        return (px + (x * math.cos(ang) - y * math.sin(ang)) * k, py + (x * math.sin(ang) + y * math.cos(ang)) * k)

    body = [rot(p) for p in plane]
    d.polygon(body, fill=(255, 111, 89, 255))
    d.polygon([rot((0, 0)), rot((-175, 0)), rot((-300, 110))], fill=(232, 85, 63, 255))
    d.line([rot((0, 0)), rot((-175, 0))], fill=(255, 255, 255, 255), width=int(10 * k))
    return img


def save(img, size, path):
    img.resize((size, size), Image.LANCZOS).save(path)


if __name__ == '__main__':
    icon = draw_icon()
    save(icon, 512, 'icons/icon-512.png')
    save(icon, 192, 'icons/icon-192.png')
    m = draw_icon(maskable=True)
    save(m, 512, 'icons/icon-maskable-512.png')
    # iOS は角丸を自動でつけるので四角い画像にする
    sq = draw_icon(maskable=True)
    save(sq, 180, 'icons/apple-touch-icon.png')
    print('icons written')
