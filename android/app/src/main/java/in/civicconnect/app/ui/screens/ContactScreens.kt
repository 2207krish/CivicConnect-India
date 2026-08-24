package `in`.civicconnect.app.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import `in`.civicconnect.app.data.AppConfig
import `in`.civicconnect.app.data.AppMedia
import `in`.civicconnect.app.ui.AppViewModel
import `in`.civicconnect.app.ui.Validators
import `in`.civicconnect.app.ui.components.CivicButton
import `in`.civicconnect.app.ui.components.CivicDropdown
import `in`.civicconnect.app.ui.components.CivicField
import `in`.civicconnect.app.ui.components.CivicHero
import `in`.civicconnect.app.ui.components.ErrorBanner
import `in`.civicconnect.app.ui.components.SoftCard
import `in`.civicconnect.app.ui.theme.Navy
import `in`.civicconnect.app.ui.theme.Saffron

private val feedbackTopics = listOf(
    "Bug / something is broken" to "bug",
    "Modification request" to "modification",
    "Development change" to "development",
    "Other feedback" to "other"
)

@Composable
fun ContactScreen(vm: AppViewModel) {
    val context = LocalContext.current
    val user = vm.user
    var name by remember { mutableStateOf(user?.name.orEmpty()) }
    var email by remember { mutableStateOf(user?.email.orEmpty()) }
    var phone by remember { mutableStateOf(user?.phone.orEmpty()) }
    var topicLabel by remember { mutableStateOf(feedbackTopics.first().first) }
    var message by remember { mutableStateOf("") }
    var localError by remember { mutableStateOf<String?>(null) }
    var status by remember { mutableStateOf<String?>(null) }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
        CivicHero(
            AppMedia.city,
            "Contact the developer.",
            "Report a bug, request a change, or reach ${AppConfig.developerName}."
        )
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text("DEVELOPMENT & SUPPORT", color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Text("Contact & feedback", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Navy)

            SoftCard {
                Text("Developer", color = Saffron, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(6.dp))
                Text(AppConfig.developerName, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = Navy)
                Spacer(Modifier.height(8.dp))
                Text(
                    "For development changes, modifications or bugs, use the form below or reach out directly.",
                    fontSize = 13.sp,
                    color = Navy.copy(alpha = 0.8f)
                )
                Spacer(Modifier.height(10.dp))
                Text(
                    AppConfig.developerEmail,
                    color = Saffron,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.clickable {
                        runCatching {
                            context.startActivity(
                                Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:${AppConfig.developerEmail}")).apply {
                                    putExtra(Intent.EXTRA_SUBJECT, "CivicConnect India feedback")
                                }
                            )
                        }
                    }
                )
                Spacer(Modifier.height(4.dp))
                Text(
                    AppConfig.developerPhoneDisplay,
                    color = Saffron,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier.clickable {
                        runCatching {
                            context.startActivity(
                                Intent(Intent.ACTION_DIAL, Uri.parse("tel:${AppConfig.developerPhone}"))
                            )
                        }
                    }
                )
            }

            Text("Send feedback", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Navy)
            ErrorBanner(localError ?: vm.error)
            if (status != null) Text(status!!, color = Color(0xFF166534), fontSize = 14.sp)

            CivicField(name, { name = it; localError = null; status = null }, "Your name")
            CivicField(email, { email = it; localError = null; status = null }, "Email", keyboardType = KeyboardType.Email)
            CivicField(
                phone,
                { phone = it.filter(Char::isDigit).take(10); localError = null; status = null },
                "Mobile number (optional)",
                keyboardType = KeyboardType.Phone
            )
            CivicDropdown(topicLabel, feedbackTopics.map { it.first }, "This is about") {
                topicLabel = it
                status = null
            }
            CivicField(
                message,
                { message = it; localError = null; status = null },
                "Message",
                singleLine = false,
                minLines = 4
            )
            CivicField(vm.serverUrl, { vm.saveServerUrl(it) }, "CivicConnect server URL")
            CivicButton("Send feedback", enabled = !vm.busy) {
                val topic = feedbackTopics.first { it.first == topicLabel }.second
                localError = Validators.name(name)
                    ?: Validators.email(email)
                    ?: Validators.optionalPhone(phone)
                    ?: Validators.feedbackMessage(message)
                if (localError != null) return@CivicButton
                vm.saveServerUrl(vm.serverUrl)
                vm.sendFeedback(
                    name.trim(),
                    email.trim().lowercase(),
                    phone.trim(),
                    topic,
                    message.trim()
                ) { result ->
                    if (result != null) {
                        status = result
                        message = ""
                    }
                }
            }
        }
    }
}
