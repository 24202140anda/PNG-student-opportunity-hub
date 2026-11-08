# PNG Student Opportunity Hub

A mobile app that gives Papua New Guinean students one place to find and track scholarships, study programmes, internships, graduate jobs and apprenticeships, instead of searching many different websites.

Developed for IS325 Mobile Application Development, PNG University of Technology.
Student: ANNELISH DAVID (24202140)

## Install the app (for the lecturer)

**Android phone (recommended)**

1. Open this link on an Android phone and download the APK: https://drive.google.com/file/d/1d017-lIJEmR4dCOXmGa-uoh07Ls5aR3r/view?usp=sharing
2. Open the downloaded file. If Android asks, allow "Install unknown apps" for your browser, then tap Install.
3. Open PNG Student Opportunity Hub and log in with one of the test accounts below.

Backup: the Expo build page, which may ask for an Expo login and expires about 13 days after the build: https://expo.dev/accounts/24202140anda/projects/PNGStudentsOpportunityHub/builds/205efc4b-469c-4ad7-96ae-d54e2d1c2616

**Run from the source code**

```bash
git clone https://github.com/24202140anda/PNG-student-opportunity-hub.git
cd PNG-student-opportunity-hub
npm install
npx expo start
```

Press `w` to open it in the browser, or scan the QR code with the Expo Go app on an Android phone. The Supabase address and public key are already set in `src/lib/supabase.ts`, so no extra setup is needed.

## Test accounts

| Role    | Email                   | Password  |
| ------- | ----------------------- | --------- | -------- |
| Student | peter6@gmail.com        | petes1840 |
| Company | davidharaikou@nbpol.com | @david123 |
| Admin   | admin1@gmail.com        |           | Test1234 |

These accounts are for testing only.

## What the app does

**Students**

- Register and log in
- Search opportunities and filter by category and by province
- See how many days are left before each deadline
- Save opportunities and see them in a Saved list
- See a deadline reminder banner for saved opportunities that close within 7 days
- Receive a phone notification 3 days before the deadline of a saved opportunity (installed APK only)
- Open the official application page for each opportunity
- See country details and a USD to kina conversion for overseas scholarships

**Companies and organizations**

- Register as a Company or Organization
- After an admin verifies them, post, edit and delete their own listings
- See how many students saved each listing

**Admin**

- Verify organizations
- Approve or reject listings before students can see them
- Add, edit and delete any listing

## Technology

- React Native with Expo (SDK 57) and TypeScript
- Expo Router for navigation (tabs and stacks)
- Supabase for login, the PostgreSQL database and row level security
- Two public APIs: REST Countries and ExchangeRate API
- react-native-svg for icons and the logo
- EAS Build to produce the Android APK

## Folder structure

```text
src/app/          screens and navigation (auth, tabs, opportunity)
src/components/   reusable parts (logo, icons, cards, chips, reminder banner)
src/context/      login state
src/lib/          Supabase client, constants, helpers
src/services/     database and API calls
```

## Security

Row level security in Supabase means students only read approved listings, organizations only change their own listings, and only admins approve listings or verify organizations. The public key in the app is designed to be public. No secret keys are stored in this project.

## About the listings

The listings come from the official websites of the organizations named in each one, checked in November 2026. Several programmes had already closed for 2027, so those entries are marked EXPECTED, and their dates are estimates based on the previous round. Always confirm dates and requirements on the organization's own page before applying.

## Known limitations

- Phone notifications do not run in Expo Go or the browser. The app shows an in-app reminder banner there instead.
- The Supabase project is on the free plan and pauses after about a week without use. If the app shows "No connection", the project may need restoring in the Supabase dashboard.
- Applications are made on each organization's official page, not inside the app.

## Planned improvements

- In-app applications and an applicants screen for organizations
- Forgot password
- Tok Pisin language option
- Offline copy of the opportunity list
