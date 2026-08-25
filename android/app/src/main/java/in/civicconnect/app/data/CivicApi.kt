package `in`.civicconnect.app.data

import android.content.SharedPreferences
import `in`.civicconnect.app.BuildConfig
import org.json.JSONArray
import org.json.JSONObject
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class CivicApi(private val prefs: SharedPreferences) {
    var baseUrl: String
        get() = (prefs.getString("api_base", null) ?: BuildConfig.API_BASE_URL).trimEnd('/')
        set(value) {
            prefs.edit().putString("api_base", value.trim().trimEnd('/')).apply()
        }

    var token: String?
        get() = prefs.getString("api_token", null)
        set(value) {
            prefs.edit().putString("api_token", value).apply()
        }

    fun register(name: String, email: String, phone: String, password: String, address: Address): JSONObject {
        return request(
            "POST",
            "/api/auth/register",
            JSONObject()
                .put("name", name)
                .put("email", email)
                .put("phone", phone)
                .put("password", password)
                .put("address", address.toApiJson()),
            auth = false
        )
    }

    fun login(email: String, password: String): JSONObject {
        return request(
            "POST",
            "/api/auth/login",
            JSONObject().put("email", email).put("password", password),
            auth = false
        )
    }

    fun verify(email: String, otp: String): JSONObject {
        return request(
            "POST",
            "/api/auth/verify-email",
            JSONObject().put("email", email).put("otp", otp),
            auth = false
        )
    }

    fun forgotPassword(email: String): JSONObject {
        return request(
            "POST",
            "/api/auth/forgot-password",
            JSONObject().put("email", email),
            auth = false
        )
    }

    fun resetPassword(email: String, otp: String, password: String, confirmPassword: String): JSONObject {
        return request(
            "POST",
            "/api/auth/reset-password",
            JSONObject()
                .put("email", email)
                .put("otp", otp)
                .put("password", password)
                .put("confirmPassword", confirmPassword),
            auth = false
        )
    }

    fun sendVerification(email: String): JSONObject {
        return request(
            "POST",
            "/api/auth/send-verification",
            JSONObject().put("email", email),
            auth = false
        )
    }

    fun inbox(email: String): JSONObject {
        return request("GET", "/api/auth/inbox?email=${java.net.URLEncoder.encode(email, "UTF-8")}", auth = false)
    }

    fun me(): JSONObject = request("GET", "/api/auth/me")

    fun logout() {
        runCatching { request("POST", "/api/auth/logout", JSONObject()) }
        token = null
    }

    fun updateProfile(name: String, phone: String, address: Address): JSONObject {
        return request(
            "POST",
            "/api/auth/profile",
            JSONObject().put("name", name).put("phone", phone).put("address", address.toApiJson())
        )
    }

    fun listComplaints(): JSONObject = request("GET", "/api/complaints")

    fun createComplaint(
        categoryId: String,
        title: String,
        description: String,
        landmark: String,
        address: Address,
        photos: List<PendingPhoto> = emptyList()
    ): JSONObject {
        val photoArray = JSONArray()
        photos.forEach { photo ->
            photoArray.put(
                JSONObject()
                    .put("name", photo.name)
                    .put("dataUrl", photo.dataUrl)
            )
        }
        return request(
            "POST",
            "/api/complaints",
            JSONObject()
                .put("categoryId", categoryId)
                .put("title", title)
                .put("description", description)
                .put("landmark", landmark)
                .put("useRegisteredAddress", false)
                .put("address", address.toApiJson())
                .put("photos", photoArray)
        )
    }

    fun track(id: String): JSONObject {
        return request("GET", "/api/track?id=${java.net.URLEncoder.encode(id, "UTF-8")}", auth = false)
    }

    fun resolve(id: String): JSONObject {
        return request("POST", "/api/complaints/resolve", JSONObject().put("id", id))
    }

    fun sendFeedback(
        name: String,
        email: String,
        phone: String,
        topic: String,
        message: String
    ): JSONObject {
        return request(
            "POST",
            "/api/feedback",
            JSONObject()
                .put("name", name)
                .put("email", email)
                .put("phone", phone)
                .put("topic", topic)
                .put("message", message),
            auth = false
        )
    }

    private fun request(method: String, path: String, body: JSONObject? = null, auth: Boolean = true): JSONObject {
        val url = URL("$baseUrl$path")
        val conn = (url.openConnection() as HttpURLConnection).apply {
            requestMethod = method
            connectTimeout = 15000
            readTimeout = 40000
            setRequestProperty("Accept", "application/json")
            setRequestProperty("Content-Type", "application/json")
            if (auth) token?.let { setRequestProperty("Authorization", "Bearer $it") }
            if (body != null) {
                doOutput = true
                OutputStreamWriter(outputStream).use { it.write(body.toString()) }
            }
        }
        val stream = if (conn.responseCode in 200..299) conn.inputStream else conn.errorStream
        val text = stream?.bufferedReader()?.readText().orEmpty()
        val json = if (text.isBlank()) JSONObject() else JSONObject(text)
        if (conn.responseCode !in 200..299) {
            val code = json.optString("code")
            val email = json.optString("email")
            val message = json.optString("error", "Request failed (${conn.responseCode}).")
            if (code == "UNVERIFIED") throw UnverifiedException(email.ifBlank { "" })
            throw IllegalStateException(message)
        }
        json.optString("sessionToken").takeIf { it.isNotBlank() }?.let { token = it }
        return json
    }
}

fun Address.toApiJson() = JSONObject()
    .put("line1", line1).put("area", area).put("city", city).put("state", state).put("pincode", pincode)

fun addressFromPublic(obj: JSONObject) = Address(
    obj.optString("line1"),
    obj.optString("area"),
    obj.optString("city"),
    obj.optString("state"),
    obj.optString("pincode")
)

fun userFromPublic(obj: JSONObject): User {
    val created = obj.optString("createdAt")
    val createdAt = created.toLongOrNull() ?: runCatching { java.time.Instant.parse(created).toEpochMilli() }.getOrDefault(System.currentTimeMillis())
    val ids = obj.optJSONArray("nearestBodyIds") ?: JSONArray()
    return User(
        id = obj.getString("id"),
        name = obj.getString("name"),
        email = obj.getString("email"),
        phone = obj.getString("phone"),
        passwordHash = "",
        address = addressFromPublic(obj.getJSONObject("address")),
        nearestBodyIds = List(ids.length()) { ids.getString(it) },
        emailVerified = obj.optBoolean("emailVerified", true),
        createdAt = createdAt
    )
}

fun parseTime(value: String): Long =
    value.toLongOrNull() ?: runCatching { java.time.Instant.parse(value).toEpochMilli() }.getOrDefault(System.currentTimeMillis())

fun complaintFromPublic(obj: JSONObject): Complaint {
    val events = obj.optJSONArray("timeline") ?: JSONArray()
    return Complaint(
        obj.getString("id"),
        obj.getString("trackingId"),
        obj.getString("userId"),
        obj.optString("citizenName"),
        obj.optString("citizenEmail"),
        obj.optString("citizenPhone"),
        obj.getString("categoryId"),
        obj.getString("title"),
        obj.getString("description"),
        obj.optString("landmark"),
        addressFromPublic(obj.getJSONObject("address")),
        obj.getString("civicBodyId"),
        obj.getString("civicBodyName"),
        obj.getString("civicBodyEmail"),
        obj.getString("status"),
        List(events.length()) {
            val item = events.getJSONObject(it)
            TimelineEvent(item.getString("status"), parseTime(item.getString("at")), item.getString("note"))
        },
        parseTime(obj.getString("createdAt")),
        parseTime(obj.getString("updatedAt")),
        photosFromPublic(obj)
    )
}

fun photosFromPublic(obj: JSONObject): List<ComplaintPhoto> {
    val photos = obj.optJSONArray("photos") ?: return emptyList()
    return List(photos.length()) {
        val item = photos.getJSONObject(it)
        ComplaintPhoto(
            item.optString("name", "photo.jpg"),
            item.optString("url").ifBlank { item.optString("dataUrl") },
            item.optInt("bytes")
        )
    }
}

fun dispatchFromPublic(obj: JSONObject) = EmailDispatch(
    obj.optString("id"),
    obj.optString("complaintId"),
    obj.optString("trackingId"),
    obj.optString("to"),
    obj.optString("toName"),
    obj.optString("subject"),
    obj.optString("body"),
    parseTime(obj.optString("sentAt"))
)
