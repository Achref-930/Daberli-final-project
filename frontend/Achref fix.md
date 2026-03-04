-Fixed- **Image carousel** — Allow multiple images per ad and show a dot-navigation carousel on card hover or swipe (mobile). 

-Pro Search Suggestions / Autocomplete

-Fix End-to-End Search on navbar

-AdminPage.tsx is corrupted — starts with orphaned SettingsPage code fragments containing // ...existing code... placeholders. The real AdminPage imports start mid-file. This will cause parse/render errors.


( Image compression ──────────────────────────────────────────────────────
// Per-image strategy:
//   • Each image is checked individually.
//   • If the image is already ≤ 500 KB → uploaded as-is, zero quality loss.
//   • If > 500 KB → Pass 1: resize to max 1400 px at 85 % quality.
//   • If still > 500 KB after Pass 1 → Pass 2: re-encode at 72 % (only large/complex images).)

