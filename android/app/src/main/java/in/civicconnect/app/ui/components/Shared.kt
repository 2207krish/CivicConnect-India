package `in`.civicconnect.app.ui.components

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import `in`.civicconnect.app.data.AppConfig
import `in`.civicconnect.app.data.MatchedCivicBody
import `in`.civicconnect.app.data.statusLabel
import `in`.civicconnect.app.ui.theme.Ivory
import `in`.civicconnect.app.ui.theme.Navy
import `in`.civicconnect.app.ui.theme.Saffron

@Composable
fun CivicHero(image: String, title: String, subtitle: String, modifier: Modifier = Modifier) {
    Box(
        modifier
            .fillMaxWidth()
            .height(240.dp)
            .clip(RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp))
    ) {
        AsyncImage(image, contentDescription = null, contentScale = ContentScale.Crop, modifier = Modifier.fillMaxSize())
        Box(
            Modifier
                .fillMaxSize()
                .background(Brush.verticalGradient(listOf(Color.Transparent, Navy.copy(alpha = 0.88f))))
        )
        Column(Modifier.align(Alignment.BottomStart).padding(20.dp)) {
            Text("CIVICCONNECT INDIA", color = Color(0xFFF4C57A), fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
            Spacer(Modifier.height(6.dp))
            Text(title, color = Color.White, fontSize = 28.sp, fontWeight = FontWeight.Bold, lineHeight = 32.sp)
            Spacer(Modifier.height(6.dp))
            Text(subtitle, color = Color(0xFFE8E0D2), fontSize = 14.sp)
        }
    }
}

@Composable
fun CivicButton(text: String, modifier: Modifier = Modifier, enabled: Boolean = true, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier.fillMaxWidth().height(52.dp),
        shape = RoundedCornerShape(28.dp),
        colors = ButtonDefaults.buttonColors(containerColor = Saffron, contentColor = Color.White)
    ) {
        Text(text, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
fun CivicOutlineButton(text: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    OutlinedButton(
        onClick = onClick,
        modifier = modifier.fillMaxWidth().height(52.dp),
        shape = RoundedCornerShape(28.dp)
    ) {
        Text(text, color = Navy, fontWeight = FontWeight.SemiBold)
    }
}

@Composable
fun CivicField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    singleLine: Boolean = true,
    minLines: Int = 1,
    password: Boolean = false,
    keyboardType: KeyboardType = KeyboardType.Text,
    error: String? = null
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        modifier = modifier.fillMaxWidth(),
        singleLine = singleLine,
        minLines = if (singleLine) 1 else minLines,
        isError = error != null,
        supportingText = error?.let { { Text(it) } },
        visualTransformation = if (password) PasswordVisualTransformation() else VisualTransformation.None,
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
        shape = RoundedCornerShape(18.dp)
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CivicDropdown(
    value: String,
    options: List<String>,
    label: String,
    modifier: Modifier = Modifier,
    onSelect: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    ExposedDropdownMenuBox(expanded = expanded, onExpandedChange = { expanded = it }, modifier = modifier) {
        OutlinedTextField(
            value = value,
            onValueChange = {},
            readOnly = true,
            label = { Text(label) },
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded) },
            modifier = Modifier.fillMaxWidth().menuAnchor(),
            shape = RoundedCornerShape(18.dp)
        )
        ExposedDropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
            options.forEach { option ->
                DropdownMenuItem(
                    text = { Text(option) },
                    onClick = {
                        onSelect(option)
                        expanded = false
                    }
                )
            }
        }
    }
}

@Composable
fun StatusChip(status: String) {
    val colors = when (status) {
        "resolved" -> Color(0xFF166534) to Color(0xFFDCFCE7)
        "in_progress" -> Color(0xFF9A3412) to Color(0xFFFFEDD5)
        "acknowledged" -> Color(0xFF1E3A5F) to Color(0xFFDBEAFE)
        "rejected" -> Color(0xFF991B1B) to Color(0xFFFEE2E2)
        else -> Saffron to Color(0xFFFFF1E4)
    }
    Text(
        text = statusLabel(status),
        color = colors.first,
        fontSize = 12.sp,
        fontWeight = FontWeight.SemiBold,
        modifier = Modifier
            .clip(RoundedCornerShape(999.dp))
            .background(colors.second)
            .padding(horizontal = 10.dp, vertical = 5.dp)
    )
}

@Composable
fun CivicBodyMatchCard(match: MatchedCivicBody) {
    SoftCard {
        Text(match.body.type.replaceFirstChar { it.uppercase() }, color = Saffron, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        Spacer(Modifier.height(4.dp))
        Text(match.body.name, fontWeight = FontWeight.Bold, color = Navy)
        Spacer(Modifier.height(4.dp))
        Text(match.body.address + ", " + match.body.city, fontSize = 13.sp, color = Color(0xFF475569))
        Spacer(Modifier.height(6.dp))
        Text(match.body.email, fontSize = 13.sp, color = Navy)
        Text(match.body.phone, fontSize = 13.sp, color = Navy)
        if (match.matchReasons.isNotEmpty()) {
            Spacer(Modifier.height(8.dp))
            Text(match.matchReasons.joinToString(" · "), fontSize = 12.sp, color = Saffron)
        }
        match.distanceKm?.let {
            Text("About $it km from your locality", fontSize = 12.sp, color = Color(0xFF64748B))
        }
    }
}

@Composable
fun ErrorBanner(message: String?) {
    if (message.isNullOrBlank()) return
    Text(
        text = message,
        color = Color(0xFF991B1B),
        fontSize = 13.sp,
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Color(0xFFFEE2E2))
            .padding(12.dp)
    )
}

@Composable
fun SoftCard(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    Card(
        modifier = modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        shape = RoundedCornerShape(24.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(Modifier.padding(18.dp)) { content() }
    }
}

@Composable
fun ScreenBackground(content: @Composable () -> Unit) {
    Box(Modifier.fillMaxSize().background(Ivory)) { content() }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun LegalLinks(baseUrl: String) {
    val context = LocalContext.current
    fun open(path: String) {
        runCatching {
            context.startActivity(
                Intent(Intent.ACTION_VIEW, Uri.parse(AppConfig.pageUrl(baseUrl, path))).apply {
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
            )
        }
    }
    FlowRow(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = androidx.compose.foundation.layout.Arrangement.Center
    ) {
        Text(
            "Privacy Policy",
            color = Saffron,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.clickable { open("/privacy") }
        )
        Text("  ·  ", color = Navy.copy(alpha = 0.5f), fontSize = 13.sp)
        Text(
            "Terms of Service",
            color = Saffron,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.clickable { open("/terms") }
        )
        Text("  ·  ", color = Navy.copy(alpha = 0.5f), fontSize = 13.sp)
        Text(
            "Civic guide",
            color = Saffron,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.clickable { open("/learn") }
        )
    }
}
