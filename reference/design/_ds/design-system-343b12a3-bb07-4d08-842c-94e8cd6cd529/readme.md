# Контур доверия — Design System

Extracted from the attached Figma file "Альфа-Банк — дизайн-система «Контур доверия».fig" (case-championship brief; source of truth for all values below — see `/METADATA.md`, `/Foundations`, `/Components`, `/Logo` pages in that file).

## Sources
- Figma file: "Альфа-Банк — дизайн-система «Контур доверия».fig" (mounted VFS, read-only)
- No codebase or slide deck was attached — this design system is Figma-only.

## Components (39 built)
**Core:** Button, ButtonIcon, Label, Token, GlyphIcon
**Forms:** Checkbox, CheckboxAtom, Radio, RadioAtom, Toggle, ToggleAtom, Input, Textarea, Select, Droplist, DroplistItems, TokenInput, FormsGlyphIcon
**Misc:** DatePicker, DatePickerItemsCell, Counter, ArrowCDown, ArrowCRight, Plus, HelpCenterButton, TitleInput, AddArticle, DesktopTablet, Input2, IcRoundSend, IconlyBoldHeart, IconlyLightShare, MiscGlyphIcon
**Navigation:** Tabs, TabItemsItem, Tooltip, FileUploaderUploader, NavGlyphIcon
**Icons:** `assets/icons/Icon.jsx` — 201-glyph Iconly Bold/Light set + brand extras, via `<Icon name="…" />`

## Tokens
`tokens/fig-tokens.css` — 42 Figma Variables (Color, Primitives/Color, Spacing, Radius). `tokens/typography.css` — reconstructed type scale (no named Figma text styles exist in the file). `tokens/fonts.css` — Golos Text via Google Fonts (the file's own stand-in for the unavailable proprietary Styrene A/B, per its Foundations page).

## Content fundamentals
Copy is Russian, direct and instructional (imperative headings like "Отступы и радиусы"). No emoji. Tone is precise/technical — the file itself annotates WCAG contrast failures and brandbook-vs-interface-grey distinctions rather than glossing over them.

## Visual foundations
- **Color:** Red `#EF3124` is the primary brand/action color; near-black `#1D1D1B` for text; grey/100 `#F4F5F7` for interface surfaces (grey/200 `#D9D9D6` reserved for print/brandbook use only); bright green `#8FEE52` and purple `#8D3AF6` as sparing accents (green fails as text color — background-only).
- **Type:** Golos Text (weights 400–900) across a scale from 13px captions to 48–56px display.
- **Spacing/radius:** tokens 4/8/16/24/32/40/48 spacing; 8/12/16/20/999(full) radius — exact figma values, not snapped to a generic 4/8 grid.
- **Cards/inputs:** flat fills on grey/100, thin 1px stroke borders, no drop shadows in the token set beyond a subtle `rgba(0,0,0,0.04)`.
- No hero photography, illustration, or gradient system was defined in the source — treat as flat/functional UI only.

## Iconography
Iconly Bold + Light glyph families (~199 icons) plus a small in-house glyph switcher (`GlyphIcon`/`FormsGlyphIcon`/etc., one per consuming folder) used inside Button/Input/Tooltip for state icons (done/plus/cancel/search/error/arrow-down/arrow-next). No emoji, no icon font — all SVG path data via `assets/icons/icon-data.js`.

## Logo
No logo raster/vector asset was copied into `assets/` — the wordmark renders as plain Golos Text type. The source file's Logo page vector paths were used only for reference and not reproduced here since exact registered-mark reproduction is out of scope for this system.

## Caveats
- Golos Text loads from Google Fonts CDN (a genuine match, not a substitute — the file's own Foundations notes flag the true brand font, Styrene A/B, as proprietary/unavailable).
- Some Iconly arrow glyphs had non-decodable boolean-operation geometry in the source and render as simplified boxes; refine against `fig_screenshot` if pixel-exact arrows are needed.
- No UI kit / full product screens or SKILL.md have been built yet.

**Ask:** let me know if you'd like a UI kit (which product screens?), foundation specimen cards for the Design System tab, or a SKILL.md — and flag anything above that should change.
