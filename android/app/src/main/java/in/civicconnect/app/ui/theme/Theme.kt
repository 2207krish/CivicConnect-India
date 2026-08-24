package `in`.civicconnect.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val Navy = Color(0xFF0B1B33)
val Saffron = Color(0xFFC45C14)
val Ivory = Color(0xFFF7F3EA)
val Cream = Color(0xFFFFFAF2)
val Sand = Color(0xFFEFE7D8)

private val colors = lightColorScheme(
    primary = Saffron,
    onPrimary = Color.White,
    secondary = Navy,
    onSecondary = Color.White,
    background = Ivory,
    onBackground = Navy,
    surface = Cream,
    onSurface = Navy
)

@Composable
fun CivicTheme(content: @Composable () -> Unit) {
    MaterialTheme(colorScheme = colors, content = content)
}
