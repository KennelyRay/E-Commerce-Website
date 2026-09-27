# VertixHub mark

![VertixHub logo](../public/brand/vertixhub-logo.png)

## Idea

Two PCB traces run from their solder pads, bend at 45 degrees (the way boards are actually routed) and meet at a via: a vertex and a hub. The via is the only part in the accent colour.

## Files

| File | Use |
| --- | --- |
| `public/brand/vertixhub-mark.svg` | Mark on light backgrounds |
| `public/brand/vertixhub-mark-inverse.svg` | Mark on dark backgrounds |
| `public/brand/vertixhub-mark-mono.svg` | One-colour printing, stamps, engraving |
| `public/brand/vertixhub-logo.png`, `-inverse.png` | Mark with wordmark, transparent PNG |
| `components/Logo.tsx` | The mark inside the website (follows the theme) |
| `app/icon.svg` | Favicon; switches colours with the browser theme |
| `app/apple-icon.png` | iOS home screen |
| `app/opengraph-image.png` | Link previews |

The mark is drawn on a 32 unit grid: traces 3.2 wide, pads 5.2 × 4.4, via radius 4.4. Keep the SVG files and `components/Logo.tsx` in sync if the geometry changes.

## Colour

| | Light | Dark |
| --- | --- | --- |
| Traces and pads | Ink `#16181B` | Paper `#EEEBE4` |
| Via | Vermilion `#B8380F` | Vermilion `#FF7247` |

## Wordmark

"VertixHub" set in Archivo ExtraBold at 125% width, all one colour. The accent stays on the via, so the name is not split into two colours.

## Use

- Smallest size: 16 px for the mark alone, 20 px mark height in the lockup.
- Clear space: at least the via's diameter on every side.
- Do not rotate it, round the pad corners, add gradients or glows, or recolour the traces in the accent.
