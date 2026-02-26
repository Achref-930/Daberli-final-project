# Admin Suggestions & Platform Features

## Table of Contents
- [Content & Quality Control](#content--quality-control)
- [User Trust & Safety](#user-trust--safety)
- [Monetization (Admin-Controlled)](#monetization-admin-controlled)
- [Admin Dashboard & Analytics](#admin-dashboard--analytics)
- [Communication & Support](#communication--support)
- [Platform Configuration (Super-Admin)](#platform-configuration-super-admin)
- [Priority Recommendation](#priority-recommendation)

---

## Content & Quality Control

### Auto-expiry for ads
Ads should expire after 30/60/90 days. Admin can configure the duration per category. Prevents stale listings cluttering the platform.

### Duplicate detection
Flag ads with similar titles/images/phones from the same user. Reduces spam.

### Reported content queue
Let users report ads (scam, inappropriate, wrong category). Admins see a "Reports" tab alongside the pending queue.

### Ad edit requires re-approval
When a user edits an approved ad (especially price or images), it goes back to `pending`. Prevents bait-and-switch.

### Category reassignment
Admin can move a misclassified ad (e.g., someone posts a car in Services) without deleting it.

### Bulk actions
Select multiple ads and approve/reject/delete/boost in one click. Saves time when the platform grows.

---

## User Trust & Safety

### User reputation score
Track ad quality, response rate, report count. Show a trust level (Bronze/Silver/Gold) on profiles.

### Temporary vs permanent ban
Suspend a user for 7 days vs permanent ban. Add `bannedUntil: Date` to User type.

### IP/device tracking
Prevent banned users from creating new accounts. Important for a marketplace.

### Verified seller program
Users submit ID documents → admin reviews → grants verified badge. Different from ad-level verification.

### Rate limiting ad posts
Free users: 3 ads/month. Verified users: 10. Admin can adjust per user. Prevents spam flooding.

---

## Monetization (Admin-Controlled)

### Boost tiers
Instead of a simple on/off boost, offer tiers:
- **Featured** — top of category
- **Spotlight** — homepage hero
- **Urgent** — color highlight

Admin sets pricing for each tier.

### Boost duration & scheduling
Boost for 7/14/30 days with auto-expiry. Admin dashboard shows active boosts and revenue.

### Premium seller subscriptions
Monthly plan: unlimited ads, auto-boost, priority support. Admin manages subscription status.

### Ad slot limits per category
Cap featured slots (e.g., max 8 boosted autos). Creates scarcity and value.

---

## Admin Dashboard & Analytics

### Dashboard stats cards
Total ads, pending queue size, registered users, active boosts, reports — at a glance.

### Category breakdown charts
Which categories are most active. Helps focus marketing.

### Wilaya heatmap
Which regions have the most listings. Helps identify growth areas.

### Activity log / audit trail
Log every admin action (who approved/rejected/boosted what, when). Accountability when you have multiple admins.

### Search analytics
What users are searching for. If "plumber Algiers" has 100 searches but 0 results, you know where to recruit sellers.

---

## Communication & Support

### Admin-to-user messaging
Send warnings before banning. Notify users why their ad was rejected (with reason dropdown: "wrong category", "missing info", "suspected scam").

### Rejection reasons
When admin rejects an ad, select a reason. User gets a notification with guidance to fix and resubmit.

### System announcements
Admin posts a banner visible to all users ("Maintenance tonight", "New category: Electronics coming soon").

### Email/SMS notifications
Notify users when their ad is approved/rejected/boosted. Requires backend integration.

---

## Platform Configuration (Super-Admin)

### Category management
Add/remove/rename categories without code changes. E.g., add "Electronics" or "Education".

### Wilaya enable/disable
Launch in Algiers first, then expand to other wilayas. Admin controls which are active.

### Pricing rules per category
Set min/max price ranges. Flag suspiciously low prices (potential scam).

### Feature flags
Toggle features on/off (messages, reviews, boosts) without deploying code.

### Terms of service / content policy
Admin-editable rules page that users must accept.

---

## Priority Recommendation

For the current stage (frontend MVP with mock data), ranked by **impact vs effort**:

| Priority | Feature | Effort | Impact |
|----------|---------|--------|--------|
| 1 | Rejection reasons | Tiny | Huge UX improvement |
| 2 | Reported content queue | Small | Adds real moderation value |
| 3 | Dashboard stats cards | Small | Makes AdminPage feel complete |
| 4 | Boost duration/tiers | Medium | Monetization foundation |
| 5 | Ad auto-expiry | Medium | Prevents stale content from day one |
