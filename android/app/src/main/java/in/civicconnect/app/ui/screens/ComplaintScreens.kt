package `in`.civicconnect.app.ui.screens

import android.content.Intent
import android.net.Uri
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Switch
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import `in`.civicconnect.app.data.Address
import `in`.civicconnect.app.data.AppMedia
import `in`.civicconnect.app.data.categories
import `in`.civicconnect.app.data.categoryById
import `in`.civicconnect.app.data.citiesByState
import `in`.civicconnect.app.data.findBestBodyForDepartment
import `in`.civicconnect.app.data.indianStates
import `in`.civicconnect.app.data.pincodeDirectory
import `in`.civicconnect.app.data.statusLabel
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
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

private fun formatWhen(ms: Long): String =
    SimpleDateFormat("d MMM yyyy, h:mm a", Locale("en", "IN")).format(Date(ms))

@Composable
fun NewComplaintScreen(vm: AppViewModel, initialCategory: String, onCreated: (String) -> Unit) {
    val user = vm.user ?: return
    var categoryId by remember { mutableStateOf(initialCategory.ifBlank { "" }) }
    var title by remember { mutableStateOf("") }
    var description by remember { mutableStateOf("") }
    var landmark by remember { mutableStateOf("") }
    var useRegistered by remember { mutableStateOf(true) }
    var line1 by remember { mutableStateOf(user.address.line1) }
    var area by remember { mutableStateOf(user.address.area) }
    var city by remember { mutableStateOf(user.address.city) }
    var state by remember { mutableStateOf(user.address.state) }
    var pincode by remember { mutableStateOf(user.address.pincode) }
    var localError by remember { mutableStateOf<String?>(null) }

    val address = if (useRegistered) user.address else Address(line1, area, city, state, pincode)
    val category = categoryById(categoryId)
    val match = remember(address, categoryId) {
        category?.let { findBestBodyForDepartment(address, it.department) }
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.road, "File a complaint.", "We email the civic body that covers this location and category.")
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            ErrorBanner(localError ?: vm.error)
            Text("Category", fontWeight = FontWeight.Bold, color = Navy)
            categories.chunked(2).forEach { row ->
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.fillMaxWidth()) {
                    row.forEach { item ->
                        FilterChip(
                            selected = categoryId == item.id,
                            onClick = { categoryId = item.id },
                            label = { Text(item.title, fontSize = 12.sp) },
                            modifier = Modifier.weight(1f)
                        )
                    }
                    if (row.size == 1) Spacer(Modifier.weight(1f))
                }
            }
            CivicField(title, { title = it }, "Issue title")
            CivicField(description, { description = it }, "Describe the problem", singleLine = false)
            CivicField(landmark, { landmark = it }, "Nearby landmark (optional)")
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                Text("Use my registered address", modifier = Modifier.weight(1f), color = Navy)
                Switch(checked = useRegistered, onCheckedChange = { useRegistered = it })
            }
            if (!useRegistered) {
                CivicField(line1, { line1 = it }, "House / street address")
                CivicField(pincode, {
                    pincode = it.filter(Char::isDigit).take(6)
                    pincodeDirectory[pincode]?.let { found ->
                        area = found.first
                        city = found.second
                        state = found.third
                    }
                }, "PIN code", keyboardType = KeyboardType.Number)
                CivicField(area, { area = it }, "Locality / area")
                CivicDropdown(state, indianStates, "State") {
                    state = it
                    if (city !in (citiesByState[it] ?: emptyList())) city = ""
                }
                CivicDropdown(city, citiesByState[state] ?: emptyList(), "City") { city = it }
            }
            match?.let {
                Text("This will be emailed to", fontWeight = FontWeight.Bold, color = Navy)
                CivicBodyMatchCard(it)
            }
            CivicButton("Submit complaint", enabled = !vm.busy) {
                localError = when {
                    categoryId.isBlank() -> "Select a complaint category"
                    else -> Validators.title(title) ?: Validators.description(description) ?: Validators.address(address)
                }
                if (localError != null) return@CivicButton
                vm.fileComplaint(categoryId, title, description, landmark, address) { created ->
                    if (created != null) onCreated(created.trackingId)
                }
            }
        }
    }
}

@Composable
fun ComplaintDetailScreen(vm: AppViewModel, trackingId: String, onBack: () -> Unit) {
    LaunchedEffect(trackingId) { vm.lookupComplaint(trackingId) {} }
    val complaint = remember(trackingId, vm.tick) { vm.complaint(trackingId) }
    val dispatch = complaint?.let { vm.dispatch(it.id) }
    val context = LocalContext.current
    val isOwner = vm.user != null && vm.user?.id == complaint?.userId

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(categoryById(complaint?.categoryId ?: "")?.image ?: AppMedia.hero, complaint?.title ?: "Complaint", trackingId)
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            if (complaint == null) {
                SoftCard { Text("No complaint found for this tracking ID.") }
                CivicOutlineButton("Back", onClick = onBack)
                return@Column
            }
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                Text(categoryById(complaint.categoryId)?.title ?: "", color = Saffron, fontWeight = FontWeight.Bold)
                StatusChip(complaint.status)
            }
            SoftCard {
                Text(complaint.description, color = Navy)
                if (complaint.landmark.isNotBlank()) {
                    Spacer(Modifier.height(8.dp))
                    Text("Landmark: ${complaint.landmark}", fontSize = 13.sp, color = Color(0xFF475569))
                }
                Spacer(Modifier.height(8.dp))
                Text(complaint.address.formatted(), fontSize = 13.sp, color = Color(0xFF475569))
            }
            SoftCard {
                Text("Assigned civic body", fontWeight = FontWeight.Bold, color = Navy)
                Spacer(Modifier.height(6.dp))
                Text(complaint.civicBodyName)
                Text(complaint.civicBodyEmail, color = Saffron, fontSize = 13.sp)
            }
            SoftCard {
                Text("Timeline", fontWeight = FontWeight.Bold, color = Navy)
                Spacer(Modifier.height(10.dp))
                complaint.timeline.forEach { event ->
                    Text(statusLabel(event.status), fontWeight = FontWeight.SemiBold, color = Navy)
                    Text(event.note, fontSize = 13.sp, color = Color(0xFF475569))
                    Text(formatWhen(event.at), fontSize = 12.sp, color = Color(0xFF94A3B8))
                    Spacer(Modifier.height(10.dp))
                }
            }
            dispatch?.let { letter ->
                SoftCard {
                    Text("Official email", fontWeight = FontWeight.Bold, color = Navy)
                    Spacer(Modifier.height(6.dp))
                    Text(letter.subject, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                    Spacer(Modifier.height(8.dp))
                    Text(letter.body, fontSize = 13.sp, color = Color(0xFF334155))
                }
                CivicOutlineButton("Open in email app") {
                    val intent = Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:${letter.to}")).apply {
                        putExtra(Intent.EXTRA_SUBJECT, letter.subject)
                        putExtra(Intent.EXTRA_TEXT, letter.body)
                    }
                    runCatching { context.startActivity(intent) }
                }
            }
            if (isOwner && complaint.status != "resolved") {
                CivicButton("Confirm this is resolved") {
                    vm.resolve(complaint.id)
                }
            }
            CivicOutlineButton("Back", onClick = onBack)
        }
    }
}

@Composable
fun TrackScreen(vm: AppViewModel, onOpen: (String) -> Unit) {
    var query by remember { mutableStateOf("") }
    var notFound by remember { mutableStateOf(false) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.traffic, "Track a complaint.", "Anyone can follow progress with a CivicConnect tracking ID.")
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            CivicField(query, { query = it.uppercase(); notFound = false }, "Tracking ID, e.g. CCI-NEW-20260823-ROAD")
            CivicButton("Look up", enabled = !vm.busy) {
                vm.lookupComplaint(query) { found ->
                    if (found == null) notFound = true else onOpen(found.trackingId)
                }
            }
            if (notFound) ErrorBanner("No complaint found for that tracking ID.")
            SoftCard {
                Text("Try a demo ID", fontWeight = FontWeight.SemiBold, color = Navy)
                Spacer(Modifier.height(6.dp))
                listOf("CCI-NEW-20260823-ROAD", "CCI-NEW-20260823-LITE").forEach { id ->
                    Text(
                        id,
                        color = Saffron,
                        modifier = Modifier.clickable {
                            query = id
                            vm.complaint(id)?.let { onOpen(it.trackingId) }
                        }.padding(vertical = 4.dp)
                    )
                }
            }
        }
    }
}

@Composable
fun DirectoryScreen(onOpenTrack: () -> Unit) {
    var query by remember { mutableStateOf("") }
    var cityFilter by remember { mutableStateOf("All cities") }
    val cities = remember { listOf("All cities") + `in`.civicconnect.app.data.civicBodies.map { it.city }.distinct().sorted() }
    val filtered = remember(query, cityFilter) {
        `in`.civicconnect.app.data.civicBodies.filter { body ->
            val matchesCity = cityFilter == "All cities" || body.city == cityFilter
            val q = query.trim()
            val matchesQuery = q.isBlank() ||
                body.name.contains(q, true) ||
                body.shortName.contains(q, true) ||
                body.city.contains(q, true) ||
                body.email.contains(q, true) ||
                body.type.contains(q, true)
            matchesCity && matchesQuery
        }
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(AppMedia.gateway, "Civic body directory.", "Municipal, electricity, water and traffic desks across India.")
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            CivicField(query, { query = it }, "Search name, city or email")
            CivicDropdown(cityFilter, cities, "City") { cityFilter = it }
            Text("${filtered.size} offices", color = Color(0xFF64748B), fontSize = 13.sp)
            filtered.forEach { body ->
                SoftCard {
                    AsyncImage(
                        when (body.type) {
                            "electricity" -> AppMedia.power
                            "water" -> AppMedia.water
                            "traffic" -> AppMedia.traffic
                            else -> AppMedia.city
                        },
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxWidth().height(110.dp).clip(RoundedCornerShape(18.dp))
                    )
                    Spacer(Modifier.height(10.dp))
                    Text(body.type.uppercase(), color = Saffron, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text(body.name, fontWeight = FontWeight.Bold, color = Navy)
                    Text("${body.address}, ${body.city} — ${body.pincode}", fontSize = 13.sp, color = Color(0xFF475569))
                    Spacer(Modifier.height(6.dp))
                    Text(body.email, color = Saffron, fontSize = 13.sp)
                    Text(body.phone, fontSize = 13.sp, color = Navy)
                    Text(body.officeHours, fontSize = 12.sp, color = Color(0xFF64748B))
                }
            }
            CivicOutlineButton("Track a complaint instead", onClick = onOpenTrack)
        }
    }
}
