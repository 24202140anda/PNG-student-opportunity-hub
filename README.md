# PNG Student Opportunity Hub

A mobile app that gives Papua New Guinean students one place to find and track scholarships, study programmes, internships, graduate jobs and apprenticeships, instead of searching many different websites.

Developed for IS323 Mobile Application Development, PNG University of Technology.
Student: YOUR NAME (YOUR STUDENT ID)

## What the app does

**Students**

- Register and log in
- Search opportunities and filter by category and by province
- See how many days are left before each deadline
- Save opportunities and see them in a Saved list
- See a deadline reminder banner for saved opportunities that close within 7 days
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

## How to run it

1. Install Node.js, then clone the project:

```bash
git clone https://github.com/24202140anda/PNG-student-opportunity-hub.git
cd PNG-student-opportunity-hub
npm install
```

2. Start the app:

```bash
npx expo start
```

3. Press `w` to open it in the browser, or scan the QR code with the Expo Go app on an Android phone.

The Supabase address and public key are already set in `src/lib/supabase.ts`, so no extra setup is needed. The Supabase project is on the free plan and pauses after about a week without use. If the app shows "No connection", the project may need restoring in the Supabase dashboard.

## Test accounts

| Role    | Email         | Password |
| ------- | ------------- | -------- |
| Student | STUDENT EMAIL | PASSWORD |
| Company | COMPANY EMAIL | PASSWORD |
| Admin   | ADMIN EMAIL   | PASSWORD |

## Android APK

APK download link: ADD YOUR EAS BUILD LINK HERE

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

## Planned improvements

- In-app applications and an applicants screen for organizations
- Forgot password
- Phone notifications for deadlines (work in the installed APK, not in Expo Go)
- Tok Pisin language option
- Offline copy of the opportunity list
