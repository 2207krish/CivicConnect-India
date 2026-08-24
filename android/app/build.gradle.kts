plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
}

android {
    namespace = "in.civicconnect.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "in.civicconnect.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 2
        versionName = "1.1"

        // Keep true until the app is on Play and you have live AdMob units.
        val useTestAds = true
        val admobAppId = if (useTestAds) {
            "ca-app-pub-3940256099942544~3347511713"
        } else {
            "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
        }
        manifestPlaceholders["admobAppId"] = admobAppId
        buildConfigField("boolean", "USE_TEST_ADS", useTestAds.toString())
        buildConfigField("String", "ADMOB_BANNER_ID", "\"${if (useTestAds) "ca-app-pub-3940256099942544/9214589741" else "ca-app-pub-XXXXXXXXXXXXXXXX/BBBBBBBBBB"}\"")
        buildConfigField("String", "ADMOB_INTERSTITIAL_ID", "\"${if (useTestAds) "ca-app-pub-3940256099942544/1033173712" else "ca-app-pub-XXXXXXXXXXXXXXXX/IIIIIIIIII"}\"")
        buildConfigField("String", "ADMOB_APP_OPEN_ID", "\"${if (useTestAds) "ca-app-pub-3940256099942544/9257395921" else "ca-app-pub-XXXXXXXXXXXXXXXX/OOOOOOOOOO"}\"")
        val apiBase = (project.findProperty("CIVIC_API_URL") as String?)
            ?: System.getenv("CIVIC_API_URL")
            ?: "http://10.0.2.2:3000"
        buildConfigField("String", "API_BASE_URL", "\"$apiBase\"")
        manifestPlaceholders["usesCleartext"] = "true"
    }

    buildTypes {
        debug {
            manifestPlaceholders["usesCleartext"] = "true"
        }
        release {
            isMinifyEnabled = false
            manifestPlaceholders["usesCleartext"] = "false"
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.10.01")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.navigation:navigation-compose:2.8.3")
    implementation("io.coil-kt:coil-compose:2.7.0")
    implementation("com.google.android.gms:play-services-ads:23.6.0")
    debugImplementation("androidx.compose.ui:ui-tooling")
}
