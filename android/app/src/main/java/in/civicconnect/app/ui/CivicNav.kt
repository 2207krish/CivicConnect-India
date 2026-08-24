package `in`.civicconnect.app.ui

import android.app.Activity
import android.net.Uri
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.AddCircle
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import `in`.civicconnect.app.ads.AdController
import `in`.civicconnect.app.ads.AdaptiveBannerAd
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import `in`.civicconnect.app.ui.screens.ComplaintDetailScreen
import `in`.civicconnect.app.ui.screens.ContactScreen
import `in`.civicconnect.app.ui.screens.DashboardScreen
import `in`.civicconnect.app.ui.screens.DirectoryScreen
import `in`.civicconnect.app.ui.screens.ForgotPasswordScreen
import `in`.civicconnect.app.ui.screens.HomeScreen
import `in`.civicconnect.app.ui.screens.LoginScreen
import `in`.civicconnect.app.ui.screens.ResetPasswordScreen
import `in`.civicconnect.app.ui.screens.NewComplaintScreen
import `in`.civicconnect.app.ui.screens.ProfileScreen
import `in`.civicconnect.app.ui.screens.RegisterScreen
import `in`.civicconnect.app.ui.screens.TrackScreen
import `in`.civicconnect.app.ui.screens.VerifyScreen
import `in`.civicconnect.app.ui.screens.WelcomeScreen
import `in`.civicconnect.app.ui.theme.Ivory
import `in`.civicconnect.app.ui.theme.Navy
import `in`.civicconnect.app.ui.theme.Saffron

private data class Tab(val route: String, val label: String, val icon: androidx.compose.ui.graphics.vector.ImageVector)

private val tabs = listOf(
    Tab("dashboard", "Home", Icons.Default.Home),
    Tab("new", "New", Icons.Default.AddCircle),
    Tab("track", "Track", Icons.Default.Search),
    Tab("directory", "Desks", Icons.Default.AccountBalance),
    Tab("profile", "Profile", Icons.Default.Person)
)

@Composable
fun CivicRoot(vm: AppViewModel, ads: AdController) {
    val nav = rememberNavController()
    val activity = LocalContext.current as Activity
    val backStack by nav.currentBackStackEntryAsState()
    val route = backStack?.destination?.route.orEmpty()
    val loggedIn = vm.user != null
    val showBar = loggedIn && (
        route == "dashboard" || route == "track" || route == "directory" || route == "profile" || route == "contact" || route.startsWith("new")
    )
    val showBanner = route !in setOf("login", "register", "forgot", "contact") &&
        !route.startsWith("verify") &&
        !route.startsWith("reset") &&
        !route.startsWith("new")

    fun go(target: String) {
        nav.navigate(target) {
            popUpTo(nav.graph.findStartDestination().id) { saveState = true }
            launchSingleTop = true
            restoreState = true
        }
    }

    Scaffold(
        containerColor = Ivory,
        bottomBar = {
            Column {
                if (showBanner) AdaptiveBannerAd()
                if (showBar) {
                    NavigationBar(containerColor = Color.White) {
                        tabs.forEach { tab ->
                            val selected = route == tab.route || route.startsWith(tab.route)
                            NavigationBarItem(
                                selected = selected,
                                onClick = { go(if (tab.route == "new") "new?category=" else tab.route) },
                                icon = { Icon(tab.icon, contentDescription = tab.label) },
                                label = { Text(tab.label) },
                                colors = NavigationBarItemDefaults.colors(
                                    selectedIconColor = Saffron,
                                    selectedTextColor = Navy,
                                    indicatorColor = Color(0xFFFFF1E4)
                                )
                            )
                        }
                    }
                }
            }
        }
    ) { padding ->
        NavHost(
            navController = nav,
            startDestination = if (loggedIn) "dashboard" else "home",
            modifier = Modifier.padding(padding)
        ) {
            composable("home") {
                HomeScreen(
                    loggedIn = loggedIn,
                    onRegister = { nav.navigate("register") },
                    onLogin = { nav.navigate("login") },
                    onDashboard = { nav.navigate("dashboard") },
                    onTrack = { nav.navigate("track") },
                    onDirectory = { nav.navigate("directory") },
                    onContact = { nav.navigate("contact") },
                    onCategory = { category ->
                        if (loggedIn) nav.navigate("new?category=$category") else nav.navigate("register")
                    }
                )
            }
            composable("login") {
                LoginScreen(
                    vm = vm,
                    onLoggedIn = {
                        nav.navigate("dashboard") { popUpTo("home") { inclusive = false } }
                    },
                    onNeedVerify = { email -> nav.navigate("verify?email=${Uri.encode(email)}") },
                    onRegister = { nav.navigate("register") },
                    onForgot = { nav.navigate("forgot") }
                )
            }
            composable("forgot") {
                ForgotPasswordScreen(
                    vm = vm,
                    onSent = { email -> nav.navigate("reset?email=${Uri.encode(email)}") },
                    onLogin = { nav.navigate("login") }
                )
            }
            composable(
                "reset?email={email}",
                arguments = listOf(navArgument("email") { type = NavType.StringType; defaultValue = "" })
            ) { entry ->
                val email = Uri.decode(entry.arguments?.getString("email").orEmpty())
                ResetPasswordScreen(vm, email) {
                    nav.navigate("login") { popUpTo("forgot") { inclusive = true } }
                }
            }
            composable("register") {
                RegisterScreen(
                    vm = vm,
                    onRegistered = { email -> nav.navigate("verify?email=${Uri.encode(email)}") },
                    onLogin = { nav.navigate("login") }
                )
            }
            composable(
                "verify?email={email}",
                arguments = listOf(navArgument("email") { type = NavType.StringType; defaultValue = "" })
            ) { entry ->
                val email = Uri.decode(entry.arguments?.getString("email").orEmpty())
                VerifyScreen(vm, email) {
                    nav.navigate("welcome") { popUpTo("register") { inclusive = true } }
                }
            }
            composable("welcome") {
                WelcomeScreen(vm) {
                    nav.navigate("dashboard") { popUpTo("welcome") { inclusive = true } }
                }
            }
            composable("dashboard") {
                DashboardScreen(
                    vm = vm,
                    onNew = { nav.navigate("new?category=") },
                    onProfile = { nav.navigate("profile") },
                    onComplaint = { nav.navigate("complaint/$it") }
                )
            }
            composable(
                "new?category={category}",
                arguments = listOf(navArgument("category") { type = NavType.StringType; defaultValue = "" })
            ) { entry ->
                NewComplaintScreen(vm, entry.arguments?.getString("category").orEmpty()) { trackingId ->
                    ads.showInterstitial(activity) {
                        nav.navigate("complaint/$trackingId") { popUpTo("dashboard") }
                    }
                }
            }
            composable(
                "complaint/{trackingId}",
                arguments = listOf(navArgument("trackingId") { type = NavType.StringType })
            ) { entry ->
                ComplaintDetailScreen(vm, entry.arguments?.getString("trackingId").orEmpty()) {
                    nav.popBackStack()
                }
            }
            composable("track") {
                TrackScreen(vm) { nav.navigate("complaint/$it") }
            }
            composable("directory") {
                DirectoryScreen { nav.navigate("track") }
            }
            composable("profile") {
                ProfileScreen(
                    vm = vm,
                    onLoggedOut = {
                        nav.navigate("home") {
                            popUpTo(0) { inclusive = true }
                        }
                    },
                    onContact = { nav.navigate("contact") }
                )
            }
            composable("contact") {
                ContactScreen(vm)
            }
        }
    }
}
