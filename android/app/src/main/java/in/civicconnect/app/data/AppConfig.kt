package `in`.civicconnect.app.data

object AppConfig {
    const val developerName = "Sh K S Shekhawat"
    const val developerEmail = "mycivicconnect@gmail.com"

    fun pageUrl(baseUrl: String, path: String): String {
        val base = baseUrl.trim().trimEnd('/')
        val suffix = if (path.startsWith("/")) path else "/$path"
        return "$base$suffix"
    }
}
