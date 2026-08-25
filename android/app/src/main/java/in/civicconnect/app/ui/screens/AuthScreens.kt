package `in`.civicconnect.app.ui.screens

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.civicconnect.app.data.Address
import `in`.civicconnect.app.data.AppMedia
import `in`.civicconnect.app.data.citiesByState
import `in`.civicconnect.app.data.indianStates
import `in`.civicconnect.app.data.pincodeDirectory
import `in`.civicconnect.app.ui.AppViewModel
import `in`.civicconnect.app.ui.Validators
import `in`.civicconnect.app.ui.components.CivicButton
import `in`.civicconnect.app.ui.components.CivicDropdown
import `in`.civicconnect.app.ui.components.CivicField
import `in`.civicconnect.app.ui.components.CivicHero
import `in`.civicconnect.app.ui.components.CivicOutlineButton
import `in`.civicconnect.app.ui.components.ErrorBanner
import `in`.civicconnect.app.ui.components.LegalLinks
import `in`.civicconnect.app.ui.components.SoftCard
import `in`.civicconnect.app.ui.theme.Navy
import `in`.civicconnect.app.ui.theme.Saffron

@Composable
fun LoginScreen(
    vm: AppViewModel,
    onLoggedIn: () -> Unit,
    onNeedVerify: (String) -> Unit,
    onRegister: () -> Unit,
    onForgot: () -> Unit
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var localError by remember { mutableStateOf<String?>(null) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.jaipur, "Welcome back.", "Sign in to file complaints and follow your civic desks.")
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("CITIZEN LOGIN", color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Text("Sign in to CivicConnect", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Navy)
            ErrorBanner(localError ?: vm.error)
            CivicField(email, { email = it; localError = null }, "Email", keyboardType = KeyboardType.Email)
            CivicField(password, { password = it; localError = null }, "Password", password = true)
            CivicButton("Sign in", enabled = !vm.busy) {
                localError = Validators.email(email) ?: if (password.isBlank()) "Enter your password" else null
                if (localError != null) return@CivicButton
                vm.saveServerUrl(vm.serverUrl)
                vm.login(email, password) { result ->
                    when (result) {
                        "ok" -> onLoggedIn()
                        else -> if (result?.startsWith("unverified:") == true) {
                            onNeedVerify(result.removePrefix("unverified:"))
                        }
                    }
                }
            }
            CivicField(vm.serverUrl, { vm.saveServerUrl(it) }, "CivicConnect server URL")
            SoftCard {
                Text("Demo citizen", fontWeight = FontWeight.SemiBold, color = Navy)
                Spacer(Modifier.height(4.dp))
                Text("citizen@demo.in  ·  Demo@123", color = Saffron, fontSize = 13.sp)
                Text("Track IDs: CCI-NEW-20260823-ROAD, CCI-NEW-20260823-LITE", fontSize = 12.sp, color = Navy.copy(alpha = 0.7f))
            }
            TextButton(onClick = onForgot) { Text("Forgot password?") }
            TextButton(onClick = onRegister) { Text("New here? Create an account") }
        }
    }
}

@Composable
fun RegisterScreen(vm: AppViewModel, onRegistered: (String) -> Unit, onLogin: () -> Unit) {
    var step by remember { mutableStateOf(1) }
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirm by remember { mutableStateOf("") }
    var line1 by remember { mutableStateOf("") }
    var area by remember { mutableStateOf("") }
    var city by remember { mutableStateOf("") }
    var state by remember { mutableStateOf("") }
    var pincode by remember { mutableStateOf("") }
    var localError by remember { mutableStateOf<String?>(null) }

    fun applyPin(value: String) {
        pincode = value.filter { it.isDigit() }.take(6)
        pincodeDirectory[pincode]?.let { (nextArea, nextCity, nextState) ->
            area = nextArea
            city = nextCity
            state = nextState
        }
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.gateway, "Register once.", "Reach the civic body nearest to your home.")
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("CITIZEN REGISTRATION", color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Text(if (step == 1) "Your details" else "Your address", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Navy)
            Text(
                if (step == 1) "We lock the portal until the email token is verified."
                else "PIN lookup fills city and state when the code is in our directory.",
                color = Navy.copy(alpha = 0.7f)
            )
            ErrorBanner(localError ?: vm.error)
            if (step == 1) {
                CivicField(name, { name = it }, "Full name")
                CivicField(email, { email = it }, "Email", keyboardType = KeyboardType.Email)
                CivicField(phone, { phone = it.filter(Char::isDigit).take(10) }, "Mobile number", keyboardType = KeyboardType.Phone)
                CivicField(password, { password = it }, "Password", password = true)
                CivicField(confirm, { confirm = it }, "Confirm password", password = true)
                CivicButton("Continue to address") {
                    localError = Validators.name(name)
                        ?: Validators.email(email)
                        ?: Validators.phone(phone)
                        ?: Validators.password(password)
                        ?: Validators.confirmPassword(password, confirm)
                    if (localError == null) step = 2
                }
            } else {
                CivicField(line1, { line1 = it }, "House / street address")
                CivicField(pincode, { applyPin(it) }, "PIN code", keyboardType = KeyboardType.Number)
                CivicField(area, { area = it }, "Locality / area")
                CivicDropdown(state, indianStates, "State") {
                    state = it
                    if (city !in (citiesByState[it] ?: emptyList())) city = ""
                }
                CivicDropdown(city, citiesByState[state] ?: emptyList(), "City") { city = it }
                CivicField(vm.serverUrl, { vm.saveServerUrl(it) }, "CivicConnect server URL")
                CivicButton("Create account", enabled = !vm.busy) {
                    val address = Address(line1, area, city, state, pincode)
                    localError = Validators.address(address)
                    if (localError != null) return@CivicButton
                    vm.saveServerUrl(vm.serverUrl)
                    vm.register(name, email, phone, password, address) { ok ->
                        if (ok) onRegistered(email.trim().lowercase())
                    }
                }
                CivicOutlineButton("Back") { step = 1 }
            }
            Text(
                "By creating an account you agree to the Privacy Policy and Terms of Service.",
                fontSize = 12.sp,
                color = Navy.copy(alpha = 0.7f)
            )
            LegalLinks(vm.serverUrl)
            TextButton(onClick = onLogin) { Text("Already registered? Sign in") }
        }
    }
}

@Composable
fun VerifyScreen(vm: AppViewModel, email: String, onVerified: () -> Unit) {
    var otp by remember { mutableStateOf("") }
    var localError by remember { mutableStateOf<String?>(null) }
    val pending = vm.pendingOtp?.takeIf { it.email == email.trim().lowercase() }

    LaunchedEffect(email) { vm.loadInbox(email) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.night, "Verify your email.", "Enter the 6-digit token sent to your inbox.")
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("EMAIL VERIFICATION", color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Text("Token sent to $email", fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Navy)
            SoftCard {
                Text("Check your email", fontWeight = FontWeight.SemiBold, color = Navy)
                Spacer(Modifier.height(4.dp))
                Text("Open the CivicConnect message and type the 6-digit token here. The same token works on the website.", fontSize = 13.sp, color = Navy.copy(alpha = 0.75f))
            }
            ErrorBanner(localError ?: vm.error)
            CivicField(otp, { otp = it.filter(Char::isDigit).take(6) }, "6-digit token", keyboardType = KeyboardType.Number)
            if (pending != null) {
                SoftCard {
                    Text("Server preview mailbox", fontWeight = FontWeight.SemiBold, color = Navy)
                    Spacer(Modifier.height(4.dp))
                    Text("SMTP is not configured, so the live token is ${pending.otp}", color = Saffron)
                }
            }
            CivicButton("Verify and continue", enabled = !vm.busy) {
                localError = Validators.otp(otp)
                if (localError != null) return@CivicButton
                vm.verify(email, otp) { ok -> if (ok) onVerified() }
            }
            CivicOutlineButton("Resend token") {
                vm.resend(email)
                localError = null
            }
        }
    }
}

@Composable
fun ForgotPasswordScreen(vm: AppViewModel, onSent: (String) -> Unit, onLogin: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var localError by remember { mutableStateOf<String?>(null) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.jaipur, "Forgot password.", "We will email a 6-digit token to reset it.")
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("ACCOUNT RECOVERY", color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Text("Reset your password", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Navy)
            ErrorBanner(localError ?: vm.error)
            CivicField(email, { email = it; localError = null }, "Email", keyboardType = KeyboardType.Email)
            CivicField(vm.serverUrl, { vm.saveServerUrl(it) }, "CivicConnect server URL")
            CivicButton("Email reset token", enabled = !vm.busy) {
                localError = Validators.email(email)
                if (localError != null) return@CivicButton
                vm.saveServerUrl(vm.serverUrl)
                vm.forgotPassword(email.trim().lowercase()) { ok ->
                    if (ok) onSent(email.trim().lowercase())
                }
            }
            TextButton(onClick = onLogin) { Text("Back to login") }
        }
    }
}

@Composable
fun ResetPasswordScreen(vm: AppViewModel, email: String, onDone: () -> Unit) {
    var otp by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var confirm by remember { mutableStateOf("") }
    var localError by remember { mutableStateOf<String?>(null) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.night, "Set a new password.", "Use the token sent to $email")
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("RESET PASSWORD", color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            SoftCard {
                Text("Check your inbox", fontWeight = FontWeight.SemiBold, color = Navy)
                Spacer(Modifier.height(4.dp))
                Text("Enter the 6-digit CivicConnect token, then choose a new password.", fontSize = 13.sp, color = Navy.copy(alpha = 0.75f))
            }
            ErrorBanner(localError ?: vm.error)
            CivicField(otp, { otp = it.filter(Char::isDigit).take(6) }, "6-digit token", keyboardType = KeyboardType.Number)
            CivicField(password, { password = it }, "New password", password = true)
            CivicField(confirm, { confirm = it }, "Confirm new password", password = true)
            CivicButton("Save password", enabled = !vm.busy) {
                localError = Validators.otp(otp)
                    ?: Validators.password(password)
                    ?: Validators.confirmPassword(password, confirm)
                if (localError != null) return@CivicButton
                vm.resetPassword(email, otp, password, confirm) { ok -> if (ok) onDone() }
            }
            CivicOutlineButton("Resend token") {
                localError = null
                vm.forgotPassword(email) { }
            }
        }
    }
}
