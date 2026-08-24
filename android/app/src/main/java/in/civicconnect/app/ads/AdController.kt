package `in`.civicconnect.app.ads

import android.app.Activity
import android.app.Application
import android.os.Handler
import android.os.Looper
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.appopen.AppOpenAd
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import `in`.civicconnect.app.BuildConfig

class AdController(private val app: Application) {
    private val main = Handler(Looper.getMainLooper())
    private var interstitial: InterstitialAd? = null
    private var appOpen: AppOpenAd? = null
    private var interstitialLoading = false
    private var appOpenLoading = false
    private var showingFullScreen = false
    private var lastInterstitialAt = 0L
    private var appOpenShownThisSession = false

    fun initialize() {
        com.google.android.gms.ads.MobileAds.initialize(app) {
            loadInterstitial()
            loadAppOpen()
        }
    }

    fun showInterstitial(activity: Activity, onFinished: () -> Unit) {
        val ready = interstitial
        val cooledDown = System.currentTimeMillis() - lastInterstitialAt >= 45_000
        if (ready == null || showingFullScreen || !cooledDown) {
            loadInterstitial()
            onFinished()
            return
        }
        showingFullScreen = true
        ready.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                showingFullScreen = false
                interstitial = null
                lastInterstitialAt = System.currentTimeMillis()
                loadInterstitial()
                onFinished()
            }

            override fun onAdFailedToShowFullScreenContent(error: AdError) {
                showingFullScreen = false
                interstitial = null
                loadInterstitial()
                onFinished()
            }
        }
        ready.show(activity)
    }

    fun showAppOpenIfAvailable(activity: Activity) {
        if (appOpenShownThisSession || showingFullScreen) return
        val ready = appOpen ?: return
        showingFullScreen = true
        ready.fullScreenContentCallback = object : FullScreenContentCallback() {
            override fun onAdDismissedFullScreenContent() {
                showingFullScreen = false
                appOpen = null
                appOpenShownThisSession = true
                loadAppOpen()
            }

            override fun onAdFailedToShowFullScreenContent(error: AdError) {
                showingFullScreen = false
                appOpen = null
                loadAppOpen()
            }
        }
        ready.show(activity)
    }

    fun preload() {
        loadInterstitial()
        loadAppOpen()
    }

    private fun loadInterstitial() {
        if (interstitial != null || interstitialLoading) return
        interstitialLoading = true
        InterstitialAd.load(
            app,
            BuildConfig.ADMOB_INTERSTITIAL_ID,
            AdRequest.Builder().build(),
            object : InterstitialAdLoadCallback() {
                override fun onAdLoaded(ad: InterstitialAd) {
                    interstitialLoading = false
                    interstitial = ad
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    interstitialLoading = false
                    interstitial = null
                    main.postDelayed({ loadInterstitial() }, 30_000)
                }
            }
        )
    }

    private fun loadAppOpen() {
        if (appOpen != null || appOpenLoading) return
        appOpenLoading = true
        AppOpenAd.load(
            app,
            BuildConfig.ADMOB_APP_OPEN_ID,
            AdRequest.Builder().build(),
            AppOpenAd.APP_OPEN_AD_ORIENTATION_PORTRAIT,
            object : AppOpenAd.AppOpenAdLoadCallback() {
                override fun onAdLoaded(ad: AppOpenAd) {
                    appOpenLoading = false
                    appOpen = ad
                }

                override fun onAdFailedToLoad(error: LoadAdError) {
                    appOpenLoading = false
                    appOpen = null
                }
            }
        )
    }
}
