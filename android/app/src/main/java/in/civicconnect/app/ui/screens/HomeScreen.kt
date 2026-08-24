package `in`.civicconnect.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
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
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import `in`.civicconnect.app.data.AppMedia
import `in`.civicconnect.app.data.categories
import `in`.civicconnect.app.ui.components.CivicButton
import `in`.civicconnect.app.ui.components.CivicHero
import `in`.civicconnect.app.ui.components.CivicOutlineButton
import `in`.civicconnect.app.ui.components.SoftCard
import `in`.civicconnect.app.ui.theme.Navy
import `in`.civicconnect.app.ui.theme.Saffron
import `in`.civicconnect.app.ui.theme.Sand

@Composable
fun HomeScreen(
    loggedIn: Boolean,
    onRegister: () -> Unit,
    onLogin: () -> Unit,
    onDashboard: () -> Unit,
    onTrack: () -> Unit,
    onDirectory: () -> Unit,
    onContact: () -> Unit,
    onCategory: (String) -> Unit
) {
    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(
            image = AppMedia.hero,
            title = "Report a civic issue to the desk nearest your home.",
            subtitle = "Register once. We match municipal, electricity, water and traffic offices to your PIN code."
        )
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            if (loggedIn) {
                CivicButton("Open my dashboard", onClick = onDashboard)
                CivicOutlineButton("File a new complaint") { onCategory("") }
            } else {
                CivicButton("Create citizen account", onClick = onRegister)
                CivicOutlineButton("I already have an account", onClick = onLogin)
            }
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                SoftCard(Modifier.weight(1f).clickable(onClick = onTrack)) {
                    Text("TRACK", color = Saffron, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(6.dp))
                    Text("Follow a tracking ID", fontWeight = FontWeight.SemiBold, color = Navy)
                }
                SoftCard(Modifier.weight(1f).clickable(onClick = onDirectory)) {
                    Text("DIRECTORY", color = Saffron, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Spacer(Modifier.height(6.dp))
                    Text("Find a civic body", fontWeight = FontWeight.SemiBold, color = Navy)
                }
            }
            SoftCard(Modifier.clickable(onClick = onContact)) {
                Text("CONTACT", color = Saffron, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(6.dp))
                Text("Developer details, bugs and feedback", fontWeight = FontWeight.SemiBold, color = Navy)
            }
        }

        Column(Modifier.background(Sand).padding(20.dp)) {
            Text("HOW IT WORKS", color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(6.dp))
            Text("From your address to the correct civic desk", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Navy)
            Spacer(Modifier.height(16.dp))
            listOf(
                "1" to "Register and verify email" to "Share your details, then enter the one-time token.",
                "2" to "See the nearest civic body" to "We match municipal, electricity and water desks to your PIN.",
                "3" to "Email the official desk" to "Your complaint is sent to the civic body's registered email.",
                "4" to "Track the complaint" to "Use your tracking ID any time to see acknowledgement and progress."
            ).forEach { (stepTitle, detail) ->
                SoftCard(Modifier.padding(bottom = 10.dp)) {
                    Text("Step ${stepTitle.first}", color = Saffron, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    Spacer(Modifier.height(4.dp))
                    Text(stepTitle.second, fontWeight = FontWeight.Bold, color = Navy, fontSize = 18.sp)
                    Spacer(Modifier.height(4.dp))
                    Text(detail, color = Color(0xFF475569), fontSize = 14.sp)
                }
            }
        }

        Column(Modifier.padding(20.dp)) {
            Text("CATEGORIES", color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(6.dp))
            Text("What can you report?", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Navy)
            Spacer(Modifier.height(14.dp))
            categories.chunked(2).forEach { row ->
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth().padding(bottom = 10.dp)) {
                    row.forEach { category ->
                        Column(
                            Modifier
                                .weight(1f)
                                .clip(RoundedCornerShape(22.dp))
                                .background(Color.White)
                                .clickable { onCategory(category.id) }
                        ) {
                            AsyncImage(
                                category.image,
                                contentDescription = category.title,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxWidth().height(96.dp)
                            )
                            Column(Modifier.padding(12.dp)) {
                                Text(category.title, fontWeight = FontWeight.Bold, color = Navy, fontSize = 14.sp)
                                Spacer(Modifier.height(4.dp))
                                Text(category.description, color = Color(0xFF64748B), fontSize = 12.sp, maxLines = 2)
                            }
                        }
                    }
                    if (row.size == 1) Spacer(Modifier.weight(1f))
                }
            }
        }

        Row(
            Modifier.padding(horizontal = 20.dp).fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            listOf("20+" to "Cities", "60+" to "Civic desks", "10" to "Categories").forEach { (value, label) ->
                SoftCard(Modifier.weight(1f)) {
                    Text(value, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Navy)
                    Text(label, color = Color(0xFF64748B), fontSize = 12.sp)
                }
            }
        }
        Spacer(Modifier.height(28.dp))
    }
}
