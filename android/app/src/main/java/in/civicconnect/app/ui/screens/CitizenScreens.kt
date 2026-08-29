package `in`.civicconnect.app.ui.screens

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.civicconnect.app.data.Address
import `in`.civicconnect.app.data.AppConfig
import `in`.civicconnect.app.data.AppMedia
import `in`.civicconnect.app.data.assignHomeCivicBodies
import `in`.civicconnect.app.data.categoryById
import `in`.civicconnect.app.data.citiesByState
import `in`.civicconnect.app.data.civicBodyById
import `in`.civicconnect.app.data.indianStates
import `in`.civicconnect.app.data.pincodeDirectory
import `in`.civicconnect.app.ui.AppViewModel
import `in`.civicconnect.app.ui.Validators
import `in`.civicconnect.app.ui.components.CivicBodyMatchCard
import `in`.civicconnect.app.ui.components.CivicButton
import `in`.civicconnect.app.ui.components.CivicDropdown
import `in`.civicconnect.app.ui.components.CivicField
import `in`.civicconnect.app.ui.components.CivicHero
import `in`.civicconnect.app.ui.components.CivicOutlineButton
import `in`.civicconnect.app.ui.components.ErrorBanner
import `in`.civicconnect.app.ui.components.SoftCard
import `in`.civicconnect.app.ui.components.StatusChip
import `in`.civicconnect.app.ui.theme.Navy
import `in`.civicconnect.app.ui.theme.Saffron

@Composable
fun WelcomeScreen(vm: AppViewModel, onContinue: () -> Unit) {
    val user = vm.user ?: return
    val matches = remember(user.address) { assignHomeCivicBodies(user.address) }
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.mumbai, "Your nearest civic desks.", "Complaints from ${user.address.city} will route to these offices.")
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("WELCOME, ${user.name.uppercase()}", color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Text("These desks cover your PIN ${user.address.pincode}", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Navy)
            matches.forEach { CivicBodyMatchCard(it) }
            CivicButton("Go to dashboard", onClick = onContinue)
        }
    }
}

@Composable
fun DashboardScreen(
    vm: AppViewModel,
    onNew: () -> Unit,
    onProfile: () -> Unit,
    onComplaint: (String) -> Unit
) {
    val user = vm.user ?: return
    LaunchedEffect(user.id) { vm.pullComplaints() }
    val complaints = remember(vm.tick) { vm.complaints() }
    val matches = remember(user.address, vm.tick) { assignHomeCivicBodies(user.address) }
    val openCount = complaints.count { it.status != "resolved" && it.status != "rejected" }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.city, "Hello, ${user.name.split(" ").first()}.", user.address.formatted())
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                CivicButton("New complaint", Modifier.weight(1f), onClick = onNew)
                CivicOutlineButton("Update address", Modifier.weight(1f), onClick = onProfile)
            }
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                listOf(complaints.size.toString() to "Total", openCount.toString() to "Open", matches.size.toString() to "Desks").forEach { (value, label) ->
                    SoftCard(Modifier.weight(1f)) {
                        Text(value, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Navy)
                        Text(label, fontSize = 12.sp, color = Color(0xFF64748B))
                    }
                }
            }
            Text("Nearest civic bodies", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Navy)
            matches.forEach { CivicBodyMatchCard(it) }
            Text("Your complaints", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Navy)
            if (complaints.isEmpty()) {
                SoftCard { Text("No complaints yet. File one and we will email the matching civic desk.") }
            } else {
                complaints.forEach { complaint ->
                    SoftCard(Modifier.clickable { onComplaint(complaint.trackingId) }) {
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(categoryById(complaint.categoryId)?.title ?: complaint.categoryId, color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                            StatusChip(complaint.status)
                        }
                        Spacer(Modifier.height(6.dp))
                        Text(complaint.title, fontWeight = FontWeight.Bold, color = Navy)
                        Spacer(Modifier.height(4.dp))
                        Text(complaint.trackingId, fontSize = 12.sp, color = Color(0xFF64748B))
                        Text(complaint.civicBodyName, fontSize = 13.sp, color = Navy.copy(alpha = 0.75f))
                    }
                }
            }
        }
    }
}

@Composable
fun ProfileScreen(vm: AppViewModel, onLoggedOut: () -> Unit, onContact: () -> Unit) {
    val user = vm.user ?: return
    var name by remember { mutableStateOf(user.name) }
    var phone by remember { mutableStateOf(user.phone) }
    var line1 by remember { mutableStateOf(user.address.line1) }
    var area by remember { mutableStateOf(user.address.area) }
    var city by remember { mutableStateOf(user.address.city) }
    var state by remember { mutableStateOf(user.address.state) }
    var pincode by remember { mutableStateOf(user.address.pincode) }
    var localError by remember { mutableStateOf<String?>(null) }
    var saved by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.park, "Your profile.", "Updating your address rematches the nearest civic desks.")
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(user.email, color = Saffron, fontWeight = FontWeight.SemiBold)
            ErrorBanner(localError)
            if (saved) Text("Profile saved. Civic desks have been rematched.", color = Color(0xFF166534))
            CivicField(name, { name = it; saved = false }, "Full name")
            CivicField(phone, { phone = it.filter(Char::isDigit).take(10); saved = false }, "Mobile number", keyboardType = KeyboardType.Phone)
            CivicField(line1, { line1 = it; saved = false }, "House / street address")
            CivicField(pincode, {
                pincode = it.filter(Char::isDigit).take(6)
                saved = false
                pincodeDirectory[pincode]?.let { match ->
                    area = match.first
                    city = match.second
                    state = match.third
                }
            }, "PIN code", keyboardType = KeyboardType.Number)
            CivicField(area, { area = it; saved = false }, "Locality / area")
            CivicDropdown(state, indianStates, "State") {
                state = it
                saved = false
                if (city !in (citiesByState[it] ?: emptyList())) city = ""
            }
            CivicDropdown(city, citiesByState[state] ?: emptyList(), "City") { city = it; saved = false }
            CivicButton("Save profile") {
                val address = Address(line1, area, city, state, pincode)
                localError = Validators.name(name) ?: Validators.phone(phone) ?: Validators.address(address)
                if (localError == null) {
                    vm.updateProfile(name.trim(), phone, address)
                    saved = true
                }
            }
            SoftCard {
                Text("Linked civic desks", fontWeight = FontWeight.Bold, color = Navy)
                Spacer(Modifier.height(8.dp))
                user.nearestBodyIds.mapNotNull { civicBodyById(it) }.forEach {
                    Text("• ${it.shortName} — ${it.name}", fontSize = 13.sp, color = Navy.copy(alpha = 0.8f))
                }
            }
            SoftCard(Modifier.clickable(onClick = onContact)) {
                Text("Development & bugs", fontWeight = FontWeight.Bold, color = Navy)
                Spacer(Modifier.height(6.dp))
                Text(
                    "For development changes, modifications or bugs, contact ${AppConfig.developerName}.",
                    fontSize = 13.sp,
                    color = Navy.copy(alpha = 0.8f)
                )
                Spacer(Modifier.height(8.dp))
                Text(AppConfig.developerEmail, color = Saffron)
                Spacer(Modifier.height(8.dp))
                Text("Open contact & feedback form", fontWeight = FontWeight.SemiBold, color = Navy)
            }
            CivicOutlineButton("Sign out") {
                vm.logout()
                onLoggedOut()
            }
        }
    }
}
