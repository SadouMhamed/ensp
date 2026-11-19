"""
Build the ENSP website presentation video from the site photos.

Output: public/videos/ensp-presentation.mp4 (1920x1080, 30 fps, no sound)
        public/videos/ensp-presentation-poster.jpg

Needs: Pillow + an ffmpeg binary.
  python3 -m venv .venv-video && .venv-video/bin/pip install pillow imageio-ffmpeg
  .venv-video/bin/python scripts/make-video.py
(If ffmpeg is installed system-wide, it is used instead of imageio-ffmpeg.)
"""

import math
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
IMG = ROOT / "public" / "images" / "site"
OUT_DIR = ROOT / "public" / "videos"
OUT = OUT_DIR / "ensp-presentation.mp4"
POSTER = OUT_DIR / "ensp-presentation-poster.jpg"

W, H, FPS = 1920, 1080, 30
FADE = 0.8  # crossfade between scenes (seconds)
ORANGE = (239, 142, 19)  # ENSP logo orange (#EF8E13)

AVENIR = "/System/Library/Fonts/Avenir Next.ttc"
F_BOLD, F_DEMI, F_MEDIUM, F_REGULAR = 0, 2, 5, 7


def font(size, idx):
    return ImageFont.truetype(AVENIR, size, index=idx)


# ---------- scenes ----------
# kind: "intro" | "service" | "outro"
# zoom: (start, end); pan: centre of the frame as fraction of image (start -> end)
SCENES = [
    dict(kind="intro", img="hero-1-equipe-forage.jpg", dur=4.6,
         zoom=(1.12, 1.0), pan=((0.5, 0.42), (0.5, 0.5))),
    dict(kind="service", img="hero-2-appareil-forage.jpg", dur=4.0,
         label="NOS MÉTIERS", title="Forage & interventions",
         zoom=(1.0, 1.12), pan=((0.45, 0.5), (0.55, 0.45))),
    dict(kind="service", img="services-essais.jpg", dur=4.0,
         label="NOS MÉTIERS", title="Essais & mesures",
         zoom=(1.12, 1.02), pan=((0.6, 0.5), (0.45, 0.5))),
    dict(kind="service", img="services-production.jpg", dur=4.0,
         label="NOS MÉTIERS", title="Production & environnement",
         zoom=(1.0, 1.1), pan=((0.5, 0.45), (0.55, 0.4))),
    dict(kind="service", img="hero-5-atelier-fabrication.jpg", dur=4.0,
         label="NOS MÉTIERS", title="Fabrication & réparation",
         zoom=(1.1, 1.0), pan=((0.35, 0.5), (0.5, 0.5))),
    dict(kind="service", img="hero-3-hse.jpg", dur=4.0,
         label="NOTRE ENGAGEMENT", title="Sécurité & HSE",
         zoom=(1.0, 1.12), pan=((0.5, 0.5), (0.52, 0.4))),
    dict(kind="service", img="vision-4-equipe-nuit.jpg", dur=4.0,
         label="NOS ÉQUIPES", title="Engagées, jour et nuit",
         zoom=(1.08, 1.0), pan=((0.55, 0.55), (0.5, 0.5))),
    dict(kind="outro", img="hero-2-appareil-forage.jpg", dur=4.8,
         zoom=(1.0, 1.06), pan=((0.5, 0.5), (0.5, 0.5))),
]


def ease(x):
    x = min(max(x, 0.0), 1.0)
    return 0.5 - 0.5 * math.cos(math.pi * x)


def ease_out(x):
    x = min(max(x, 0.0), 1.0)
    return 1 - (1 - x) ** 3


# ---------- prepared layers ----------
def bottom_left_shade():
    """Dark gradient bottom-left so white text stays readable."""
    g = Image.new("L", (W, H), 0)
    px = g.load()
    for y in range(H):
        vy = max(0.0, (y - H * 0.35) / (H * 0.65))
        for x in range(0, W, 4):
            vx = max(0.0, 1 - x / (W * 0.85))
            a = int(215 * (vy ** 1.4) * (0.35 + 0.65 * vx))
            for dx in range(4):
                px[x + dx, y] = a
    shade = Image.new("RGBA", (W, H), (10, 10, 10, 0))
    shade.putalpha(g)
    return shade


def full_shade(alpha):
    return Image.new("RGBA", (W, H), (12, 12, 12, alpha))


def draw_text(draw, xy, text, fnt, fill, anchor, tracking):
    if not tracking:
        draw.text(xy, text, font=fnt, fill=fill, anchor=anchor)
        return
    # letter-spaced text (labels): lay out char by char
    widths = [fnt.getlength(c) for c in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = xy[0] - (total / 2 if anchor[0] == "m" else 0)
    for c, w in zip(text, widths):
        draw.text((x, xy[1]), c, font=fnt, fill=fill, anchor="l" + anchor[1])
        x += w + tracking


def text_with_shadow(draw_target, xy, text, fnt, fill, anchor="la", tracking=0):
    """Draw text with a soft shadow onto an RGBA layer."""
    shadow = Image.new("RGBA", draw_target.size, (0, 0, 0, 0))
    draw_text(ImageDraw.Draw(shadow), (xy[0], xy[1] + 3), text, fnt,
              (0, 0, 0, 170), anchor, tracking)
    shadow = shadow.filter(ImageFilter.GaussianBlur(6))
    draw_target.alpha_composite(shadow)
    draw_text(ImageDraw.Draw(draw_target), xy, text, fnt, fill, anchor, tracking)


def service_layers(s):
    """Return (label layer, title layer, bar length) for a service scene."""
    x0, y_title = 120, H - 210
    label = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    text_with_shadow(label, (x0, y_title - 62), s["label"], font(30, F_DEMI),
                     ORANGE + (255,), tracking=5)
    title = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    text_with_shadow(title, (x0, y_title), s["title"], font(84, F_BOLD),
                     (255, 255, 255, 255))
    return label, title


LOGO = Image.open(ROOT / "public" / "brand" / "ensp-logo.png").convert("RGBA")


def logo_sized(h):
    w = round(LOGO.width * h / LOGO.height)
    return LOGO.resize((w, h), Image.LANCZOS)


def intro_layers():
    logo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    lg = logo_sized(170)
    logo.alpha_composite(lg, ((W - lg.width) // 2, 250))

    name = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    text_with_shadow(name, (W // 2, 560), "ENSP", font(150, F_BOLD),
                     (255, 255, 255, 255), anchor="mm")

    sub = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    text_with_shadow(sub, (W // 2, 680), "Entreprise Nationale de Services aux Puits",
                     font(46, F_MEDIUM), (255, 255, 255, 255), anchor="mm")
    text_with_shadow(sub, (W // 2, 760), "FILIALE DU GROUPE SONATRACH",
                     font(30, F_DEMI), ORANGE + (255,), anchor="mm", tracking=6)
    return logo, name, sub


def outro_layers():
    logo = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    lg = logo_sized(190)
    logo.alpha_composite(lg, ((W - lg.width) // 2, 240))

    line1 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    text_with_shadow(line1, (W // 2, 560), "Au service des puits depuis 1981",
                     font(72, F_BOLD), (255, 255, 255, 255), anchor="mm")

    line2 = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    text_with_shadow(line2, (W // 2, 665), "www.enspgroup.com",
                     font(40, F_DEMI), ORANGE + (255,), anchor="mm")
    return logo, line1, line2


def place(base, layer, alpha, dy=0):
    """Composite `layer` onto base with opacity `alpha` and a vertical offset."""
    if alpha <= 0:
        return
    l = layer
    if dy:
        l = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        l.alpha_composite(layer, (0, int(round(dy))))
    if alpha < 1:
        a = l.getchannel("A").point(lambda v: int(v * alpha))
        l = l.copy()
        l.putalpha(a)
    base.alpha_composite(l)


def appear(t, start, length=0.7):
    """0..1 progress of an element appearing at `start` seconds."""
    return ease_out((t - start) / length)


# ---------- photo motion ----------
def ken_burns(img, t_norm, zoom, pan):
    sw, sh = img.size
    cover = max(W / sw, H / sh)
    e = ease(t_norm)
    z = zoom[0] + (zoom[1] - zoom[0]) * e
    cx = pan[0][0] + (pan[1][0] - pan[0][0]) * e
    cy = pan[0][1] + (pan[1][1] - pan[0][1]) * e
    cw, ch = W / (cover * z), H / (cover * z)
    left = min(max(cx * sw - cw / 2, 0), sw - cw)
    top = min(max(cy * sh - ch / 2, 0), sh - ch)
    k = cw / W
    return img.transform((W, H), Image.AFFINE, (k, 0, left, 0, k, top),
                         resample=Image.BICUBIC)


def main():
    ff = shutil.which("ffmpeg")
    if not ff:
        import imageio_ffmpeg
        ff = imageio_ffmpeg.get_ffmpeg_exe()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    shade_bl = bottom_left_shade()

    # load + prepare each scene
    for s in SCENES:
        im = Image.open(IMG / s["img"]).convert("RGB")
        if s["kind"] == "outro":
            im = im.filter(ImageFilter.GaussianBlur(10))
        s["im"] = im
        if s["kind"] == "service":
            s["layers"] = service_layers(s)
        elif s["kind"] == "intro":
            s["layers"] = intro_layers()
        else:
            s["layers"] = outro_layers()

    # start times (scenes overlap by FADE)
    t = 0.0
    for s in SCENES:
        s["start"] = t
        t += s["dur"] - FADE
    total = t + FADE
    n_frames = int(round(total * FPS))

    def render_scene(s, lt):
        frame = ken_burns(s["im"], lt / s["dur"], s["zoom"], s["pan"]).convert("RGBA")
        if s["kind"] == "service":
            frame.alpha_composite(shade_bl)
            label, title = s["layers"]
            p1, p2 = appear(lt, 0.35), appear(lt, 0.55)
            place(frame, label, p1, dy=(1 - p1) * 25)
            place(frame, title, p2, dy=(1 - p2) * 35)
            # orange accent bar growing under the title
            pb = appear(lt, 0.8, 0.8)
            if pb > 0:
                ImageDraw.Draw(frame).rectangle(
                    (120, H - 92, 120 + int(140 * pb), H - 84), fill=ORANGE + (255,))
        else:
            frame.alpha_composite(full_shade(150))
            a, b, c = s["layers"]
            p1, p2, p3 = appear(lt, 0.3, 0.9), appear(lt, 0.7), appear(lt, 1.1)
            place(frame, a, p1, dy=(1 - p1) * 20)
            place(frame, b, p2, dy=(1 - p2) * 30)
            place(frame, c, p3, dy=(1 - p3) * 30)
        return frame.convert("RGB")

    cmd = [ff, "-y", "-loglevel", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
           "-i", "-",
           "-c:v", "libx264", "-preset", "slow", "-crf", "24",
           "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", str(OUT)]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)

    poster_frame = None
    for i in range(n_frames):
        ft = i / FPS
        active = [s for s in SCENES if s["start"] <= ft < s["start"] + s["dur"]]
        frames = []
        for s in active:
            lt = ft - s["start"]
            frames.append((s, render_scene(s, lt)))
        out = frames[0][1]
        if len(frames) > 1:
            s2, f2 = frames[1]
            mix = ease((ft - s2["start"]) / FADE)
            out = Image.blend(out, f2, mix)
        # fade from / to black at the very start and end
        edge = min(ft / 0.6, (total - ft) / 0.8, 1.0)
        if edge < 1:
            out = Image.blend(Image.new("RGB", (W, H)), out, ease(edge))
        if poster_frame is None and ft >= 2.6:
            poster_frame = out.copy()
        proc.stdin.write(out.tobytes())
        if i % FPS == 0:
            print(f"\r{ft:5.1f}s / {total:.1f}s", end="", file=sys.stderr, flush=True)

    proc.stdin.close()
    proc.wait()
    poster_frame.save(POSTER, quality=85)
    print(f"\nDone: {OUT} ({total:.1f}s)", file=sys.stderr)


if __name__ == "__main__":
    main()
