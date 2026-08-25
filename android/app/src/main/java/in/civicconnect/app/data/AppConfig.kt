package `in`.civicconnect.app.data

object AppConfig {
    const val developerName = "Sh K S Shekhawat"
    const val developerEmail = "krishanshekhawat@gmail.com"
    const val developerPhone = "8975505854"
    const val developerPhoneDisplay = "+91 89755 05854"

    fun pageUrl(baseUrl: String, path: String): String {
        val base = baseUrl.trim().trimEnd('/')
        val suffix = if (path.startsWith("/")) path else "/$path"
        return "$base$suffix"
    }
}
