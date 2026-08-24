package `in`.civicconnect.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.lifecycle.viewmodel.compose.viewModel
import `in`.civicconnect.app.ui.AppViewModel
import `in`.civicconnect.app.ui.AppViewModelFactory
import `in`.civicconnect.app.ui.CivicRoot
import `in`.civicconnect.app.ui.theme.CivicTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val app = application as CivicApp
        setContent {
            CivicTheme {
                val vm: AppViewModel = viewModel(factory = AppViewModelFactory(app.store))
                CivicRoot(vm, app.ads)
            }
        }
    }

    override fun onStart() {
        super.onStart()
        (application as CivicApp).ads.showAppOpenIfAvailable(this)
    }
}
