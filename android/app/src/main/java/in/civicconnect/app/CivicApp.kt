package `in`.civicconnect.app

import android.app.Application
import `in`.civicconnect.app.ads.AdController
import `in`.civicconnect.app.data.AppStore

class CivicApp : Application() {
    lateinit var store: AppStore
        private set
    lateinit var ads: AdController
        private set

    override fun onCreate() {
        super.onCreate()
        store = AppStore(this)
        ads = AdController(this)
        ads.initialize()
    }
}
