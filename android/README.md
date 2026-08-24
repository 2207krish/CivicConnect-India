# CivicConnect India — Android app

Native Kotlin + Jetpack Compose app with the same citizen flow as the web portal: register, verify email, match the nearest civic desks, file a complaint, track it, and browse the civic-body directory.

## Open in Android Studio

1. Open the `android` folder (not the repo root) in Android Studio.
2. Let Gradle sync. Android Studio will create `local.properties` with your SDK path.
3. Run on an emulator or device (API 26+).

If the Gradle wrapper JAR is missing, Android Studio can generate it, or from this folder run:

```
gradle wrapper
```

## Features

- Register with name, email, phone, password, and address (PIN lookup fills city/state)
- Forgot password: email a 6-digit token, then set a new password
- Contact & feedback: developer email/phone plus in-app feedback form
- 6-digit email OTP shown in the in-app mailbox
- Welcome screen with nearest municipal / electricity / water / traffic desks
- Dashboard, new complaint, complaint timeline, public tracking
- Civic-body directory for 20+ cities
- Profile address update rematches civic desks
- Demo login: `citizen@demo.in` / `Demo@123`
- Demo tracking IDs: `CCI-NEW-20260823-ROAD`, `CCI-NEW-20260823-LITE`

The app talks to the CivicConnect website for live login, email token verification, and complaint tracking. Set the server URL in the app if it is not already `http://10.0.2.2:3000` (emulator) or your site origin.

## In-app ads (AdMob)

The app includes Google AdMob ads:

- Adaptive **banner** on Home, Dashboard, Track, Directory, Profile, and complaint detail
- **Interstitial** after a complaint is submitted
- **App-open** ad when the app returns to the foreground

Test ads are on by default so you can run the app without a live AdMob account.

### Turn on live ads and earn

1. Create an [AdMob](https://admob.google.com/) account and add this Android app (`in.civicconnect.app`).
2. Create three ad units: Banner, Interstitial, and App open.
3. Publish the app on Google Play. AdMob usually needs a Play listing before it serves real ads.
4. In `android/app/build.gradle.kts`, set `useTestAds = false` and replace the `ca-app-pub-XXXXXXXX...` placeholders with your AdMob app ID and ad unit IDs.
5. Rebuild a release APK/AAB and upload it to Play.

Do not click your own ads. That can get the AdMob account banned.
