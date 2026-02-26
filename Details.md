Here is a detailed review of your Daberli project:

Daberli Project — Detailed Review
Stack
React 19 + TypeScript + Vite 6 + Tailwind CSS v4 + React Router v7 + Lucide Icons. Clean, modern stack with no unnecessary dependencies.

Critical Issues
1. [AdminPage.tsx] — File is corrupted
AdminPage.tsx starts with orphaned SettingsPage code fragments containing // ...existing code... stubs, then continues with the actual AdminPage code. This is a leftover from a failed/partial edit. The real AdminPage logic appears to work from line ~55 onward, but the file header is broken TypeScript that may cause build errors depending on how the parser handles it.

2. No 404 fallback route
App.tsx defines routes for /, /auto, /real-estate, /jobs, /services, /admin, /my-ads, /messages, /profile, /settings — but has no <Route path="*" /> catch-all. Any unknown URL silently renders nothing.

High Severity
3. Dead files — CategoryPage.tsx and ServiceGrid.tsx

CategoryPage.tsx — fully implemented (137 lines) with its own local auth/post-ad modal state, but never imported or routed anywhere. It was superseded by the individual AutoPage, RealEstatePage, etc.
ServiceGrid.tsx — 77-line component, never imported by any page. Superseded by the Hero category grid.
Both are dead code and create maintenance confusion.

4. Search is non-functional end-to-end

handleSearch in App.tsx:165 navigates to /${category} but also appends ?q=... to the URL for the home-scroll case. Neither the q param is ever consumed by any page, nor does navigating to /auto apply any filter.
The search input inside AutoPage.tsx:55 is a fully uncontrolled <input> with no value, no onChange, and no state — it is visually present but does nothing.
5. Admin cannot boost ads
The isBoosted field drives the entire "Featured Listings" section on the home page. It is hardcoded on 2 mock ads in constants.ts but AdminPage.tsx only exposes Approve/Reject buttons — there is no way for an admin to actually boost or unboost a live listing.

6. FloatingActionBar — 2 of 5 buttons are dead
FloatingActionBar.tsx: the "Saved" and "Search" buttons have no onClick handler at all. They are visible UI that does nothing.

Medium Severity
7. adData: any weakens type safety
handlePostAdSubmit(adData: any) in App.tsx:87 and onSubmit: (adData: any) in PostAdModal.tsx:9 bypass TypeScript's guarantees. A PostAdFormData interface should be defined.

8. PostAdModal — useEffect cleanup misfire
The useEffect in PostAdModal.tsx:24 lists [formData.image] as its dependency. This means it runs its cleanup (revoking the blob URL) on every image change, not just unmount — potentially revoking the URL while it's still in use. The cleanup should only run on unmount (empty dependency array, or use a ref for the previous URL).

9. Auth with pre-filled credentials
AuthModal.tsx:12 initializes state with email: 'user@daberli.dz' and password: 'password'. While this is a mock, it is exposed in source and could leak into an accidentally deployed build.

10. Hardcoded user ID
handleSignIn in App.tsx:53 always assigns id: 'u123'. The mock review data in ProfilePage.tsx is disconnected from real ad data and is always displayed regardless of which user is logged in.

11. Messages sorted by ID string, not timestamp
MessagesPage.tsx:68 sorts threads by bLast.localeCompare(aLast) on the message id string (which is a random string). This is coincidentally somewhat correct but semantically wrong — it should sort by timestamp.

12. AutoCard reads undefined detail keys
AutoCard.tsx:44 reads ad.details?.mileage, ad.details?.fuelType, ad.details?.transmission, ad.details?.year. The MOCK_ADS for the auto category use { Year: 2019, Fuel: 'Essence' } (different casing/keys), so these fields always fall through to the || 'N/A' / || 'Gas' defaults. There's a key naming mismatch between what the card expects and what the data provides.

Low Severity
13. onPostAdSubmit spread into sharedProps but not in HomePageProps
App.tsx:176 spreads onPostAdSubmit: handlePostAdSubmit via {...sharedProps} into HomePage, but HomePage.tsx:9 does not declare onPostAdSubmit in its HomePageProps interface. This prop is silently ignored.

14. Hero — "Vehicle" card has duplicate subtitle
Hero.tsx:39: the Vehicle link shows "Vehicle" as both the title and the subtitle <p> — the subtitle should read "Cars & trucks" or similar.

15. Admin route is unprotected by redirect
Navigating to /admin when not an admin shows an "Access Denied" screen. It should redirect (<Navigate to="/" />) instead of just rendering a message, for better UX and security-by-convention.

16. vite.config.ts wires up GEMINI_API_KEY
vite.config.ts:18 exposes a Gemini API key via define, but there are no AI features anywhere in the current codebase. This is dead config surfacing an unused secret.

17. cards/ directory — partial use
AutoCard is used by AutoPage.tsx. JobCard, RealEstateCard, and cards/ServiceCard — need to confirm they are all actually imported by corresponding pages, or they may also be dead.

Summary Table
Area	Issue	Severity
AdminPage.tsx	Corrupted file with orphaned code stubs	Critical
Routing	No 404 fallback route	Critical
CategoryPage / ServiceGrid	Dead code never used	High
Search	Non-functional (uncontrolled input, params ignored)	High
Admin boost UI	No way to set isBoosted	High
FloatingActionBar	2 non-functional buttons	High
Type safety	adData: any in PostAdModal/App	Medium
PostAdModal	useEffect cleanup fires on every change	Medium
AuthModal	Pre-filled credentials in source	Medium
User ID	Always hardcoded 'u123'	Medium
Messages	Sorted by ID string not timestamp	Medium
AutoCard	Detail key mismatch with mock data	Medium
sharedProps	Unused onPostAdSubmit in HomePage	Low
Hero	Duplicate "Vehicle" subtitle text	Low
Admin route	Should redirect instead of showing gated UI	Low
vite.config	GEMINI_API_KEY wired with no AI feature	Low
