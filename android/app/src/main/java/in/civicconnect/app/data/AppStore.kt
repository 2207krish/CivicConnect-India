package `in`.civicconnect.app.data

import android.content.Context
import android.content.SharedPreferences
import org.json.JSONArray
import org.json.JSONObject
import java.security.MessageDigest
import java.util.UUID
import kotlin.random.Random

class AppStore(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("civicconnect", Context.MODE_PRIVATE)
    val api = CivicApi(prefs)

    init {
        seedDemo()
    }

    var users: MutableList<User> = loadUsers()
        private set
    var complaints: MutableList<Complaint> = loadComplaints()
        private set
    var dispatches: MutableList<EmailDispatch> = loadDispatches()
        private set
    var pendingOtp: PendingOtp? = loadOtp()
        private set

    val currentUser: User?
        get() {
            val id = prefs.getString("session_user", null) ?: return null
            return users.find { it.id == id && it.emailVerified }
        }

    fun register(
        name: String,
        email: String,
        phone: String,
        password: String,
        address: Address
    ): Result<User> {
        return runCatching {
            api.register(name, email, phone, password, address)
            val user = User(
                id = email.trim().lowercase(),
                name = name.trim(),
                email = email.trim().lowercase(),
                phone = phone.trim(),
                passwordHash = "",
                address = address,
                nearestBodyIds = assignHomeCivicBodies(address).map { it.body.id },
                emailVerified = false,
                createdAt = System.currentTimeMillis()
            )
            cacheUser(user)
            refreshInbox(email)
            user
        }
    }

    fun login(email: String, password: String): Result<User> {
        return runCatching {
            val payload = api.login(email, password)
            val user = userFromPublic(payload.getJSONObject("user"))
            cacheUser(user)
            prefs.edit().putString("session_user", user.id).apply()
            user
        }
    }

    fun verifyEmail(email: String, otp: String): Result<User> {
        return runCatching {
            val payload = api.verify(email, otp)
            val user = userFromPublic(payload.getJSONObject("user"))
            cacheUser(user)
            pendingOtp = null
            saveOtp()
            prefs.edit().putString("session_user", user.id).apply()
            user
        }
    }

    fun resendOtp(email: String): PendingOtp? {
        runCatching { api.sendVerification(email) }
        return refreshInbox(email)
    }

    fun refreshInbox(email: String): PendingOtp? {
        return runCatching {
            val message = api.inbox(email).optJSONObject("message") ?: return null
            val otp = message.optString("otp")
            if (otp.isBlank()) {
                pendingOtp = null
                saveOtp()
                return null
            }
            pendingOtp = PendingOtp(email.trim().lowercase(), otp, System.currentTimeMillis() + 15 * 60 * 1000)
            saveOtp()
            pendingOtp
        }.getOrNull()
    }

    fun syncSession(): User? {
        return runCatching {
            val payload = api.me()
            val userObj = payload.optJSONObject("user") ?: return null
            val user = userFromPublic(userObj)
            cacheUser(user)
            prefs.edit().putString("session_user", user.id).apply()
            user
        }.getOrNull()
    }

    fun logout() {
        runCatching { api.logout() }
        prefs.edit().remove("session_user").apply()
    }

    fun updateProfile(name: String, phone: String, address: Address): User {
        val payload = api.updateProfile(name, phone, address)
        val user = userFromPublic(payload.getJSONObject("user"))
        cacheUser(user)
        return user
    }

    private fun cacheUser(user: User) {
        val index = users.indexOfFirst { it.email == user.email || it.id == user.id }
        if (index == -1) users.add(user) else users[index] = user
        saveUsers()
    }

    fun createComplaint(
        categoryId: String,
        title: String,
        description: String,
        landmark: String,
        address: Address,
        photos: List<PendingPhoto> = emptyList()
    ): Complaint {
        val payload = api.createComplaint(categoryId, title, description, landmark, address, photos)
        val complaint = complaintFromPublic(payload.getJSONObject("complaint"))
        payload.optJSONObject("dispatch")?.let {
            val dispatch = dispatchFromPublic(it)
            dispatches.removeAll { item -> item.complaintId == dispatch.complaintId }
            dispatches.add(0, dispatch)
            saveDispatches()
        }
        complaints.removeAll { it.id == complaint.id }
        complaints.add(0, complaint)
        saveComplaints()
        return complaint
    }

    fun userComplaints(): List<Complaint> {
        val user = currentUser ?: return emptyList()
        return complaints.filter { it.userId == user.id }.map { refreshStatus(it) }
            .sortedByDescending { it.createdAt }
    }

    fun pullComplaints() {
        val remote = api.listComplaints().optJSONArray("complaints") ?: return
        complaints = List(remote.length()) { complaintFromPublic(remote.getJSONObject(it)) }.toMutableList()
        saveComplaints()
    }

    fun complaintByTrackingId(id: String): Complaint? {
        return complaints.find { it.trackingId.equals(id.trim(), true) }?.let { refreshStatus(it) }
    }

    fun pullComplaint(id: String): Complaint? {
        val payload = api.track(id)
        val complaint = complaintFromPublic(payload.getJSONObject("complaint"))
        payload.optJSONObject("dispatch")?.let {
            val dispatch = dispatchFromPublic(it)
            dispatches.removeAll { item -> item.complaintId == dispatch.complaintId }
            dispatches.add(0, dispatch)
            saveDispatches()
        }
        val index = complaints.indexOfFirst { it.id == complaint.id }
        if (index == -1) complaints.add(complaint) else complaints[index] = complaint
        saveComplaints()
        return complaint
    }

    fun dispatchFor(complaintId: String) = dispatches.find { it.complaintId == complaintId }

    fun confirmResolved(complaintId: String) {
        runCatching {
            val complaint = complaintFromPublic(api.resolve(complaintId).getJSONObject("complaint"))
            val index = complaints.indexOfFirst { it.id == complaint.id }
            if (index == -1) complaints.add(complaint) else complaints[index] = complaint
            saveComplaints()
        }
    }

    private fun issueOtp(email: String): PendingOtp {
        val otp = Random.nextInt(0, 1_000_000).toString().padStart(6, '0')
        pendingOtp = PendingOtp(email.trim().lowercase(), otp, System.currentTimeMillis() + 15 * 60 * 1000)
        saveOtp()
        return pendingOtp!!
    }

    private fun generateTrackingId(city: String): String {
        val code = city.filter { it.isLetter() }.take(3).uppercase().ifBlank { "IND" }
        val stamp = java.text.SimpleDateFormat("yyyyMMdd").format(java.util.Date())
        val random = (1..4).map { "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".random() }.joinToString("")
        return "CCI-$code-$stamp-$random"
    }

    private fun refreshStatus(complaint: Complaint): Complaint {
        if (complaint.status == "resolved" || complaint.status == "rejected") return complaint
        val minutes = (System.currentTimeMillis() - complaint.createdAt) / 60000.0
        val next = when {
            minutes >= 15 -> "resolved"
            minutes >= 5 -> "in_progress"
            minutes >= 2 -> "acknowledged"
            else -> "email_sent"
        }
        val flow = listOf("submitted", "email_sent", "acknowledged", "in_progress", "resolved")
        val currentIndex = flow.indexOf(complaint.status)
        val nextIndex = flow.indexOf(next)
        if (nextIndex <= currentIndex) return complaint
        val notes = mapOf(
            "acknowledged" to "The civic body desk has acknowledged your complaint.",
            "in_progress" to "A field team has been assigned and work is in progress.",
            "resolved" to "The civic body has marked this complaint as resolved."
        )
        val timeline = complaint.timeline.toMutableList()
        for (i in (currentIndex + 1)..nextIndex) {
            val status = flow[i]
            if (timeline.none { it.status == status }) {
                timeline += TimelineEvent(status, System.currentTimeMillis(), notes[status] ?: statusLabel(status))
            }
        }
        val updated = complaint.copy(status = next, timeline = timeline, updatedAt = System.currentTimeMillis())
        val index = complaints.indexOfFirst { it.id == complaint.id }
        if (index != -1) {
            complaints[index] = updated
            saveComplaints()
        }
        return updated
    }

    private fun composeEmail(
        user: User,
        categoryTitle: String,
        title: String,
        description: String,
        landmark: String,
        address: Address,
        body: CivicBody,
        trackingId: String
    ): Pair<String, String> {
        val subject = "[$trackingId] Civic complaint — $categoryTitle — ${address.area.ifBlank { address.city }}"
        val letter = """
            To
            The Concerned Officer
            ${body.name}
            ${body.address}, ${body.city} - ${body.pincode}

            Subject: $subject

            Respected Sir/Madam,

            I, ${user.name}, a resident of ${address.formatted()}, wish to formally register the following civic complaint through CivicConnect India.

            Tracking ID: $trackingId
            Category: $categoryTitle
            Issue title: $title
            ${if (landmark.isNotBlank()) "Nearby landmark: $landmark" else ""}
            Location: ${address.formatted()}

            Details of the problem:
            $description

            I request you to kindly inspect the site and take necessary action at the earliest. I am available on ${user.phone} / ${user.email} for any clarification.

            Yours faithfully,
            ${user.name}
            ${user.phone}
            ${user.email}
        """.trimIndent()
        return subject to letter
    }

    private fun seedDemo() {
        if (prefs.getBoolean("seeded", false)) return
        val address = Address("14, Barakhamba Road", "Connaught Place", "New Delhi", "Delhi", "110001")
        val demo = User(
            id = "demo-anita-sharma",
            name = "Anita Sharma",
            email = "citizen@demo.in",
            phone = "9876543210",
            passwordHash = hashPassword("Demo@123"),
            address = address,
            nearestBodyIds = assignHomeCivicBodies(address).map { it.body.id },
            emailVerified = true,
            createdAt = System.currentTimeMillis() - 20 * 60 * 1000
        )
        users = mutableListOf(demo)
        val older = System.currentTimeMillis() - 12 * 60 * 1000
        val recent = System.currentTimeMillis() - 60 * 1000
        val municipal = civicBodyById("municipal-new-delhi")!!
        complaints = mutableListOf(
            Complaint(
                "demo-complaint-light", "CCI-NEW-20260823-LITE", demo.id, demo.name, demo.email, demo.phone,
                "street_lights", "Street lights out on the inner circle",
                "Three consecutive street lights on the inner circle have been dark for four nights.",
                "Near Palika Bazaar gate", address, municipal.id, municipal.name, municipal.email, "email_sent",
                listOf(
                    TimelineEvent("submitted", recent, "Complaint registered on CivicConnect India."),
                    TimelineEvent("email_sent", recent, "Official complaint emailed to ${municipal.email}.")
                ),
                recent, recent
            ),
            Complaint(
                "demo-complaint-road", "CCI-NEW-20260823-ROAD", demo.id, demo.name, demo.email, demo.phone,
                "roads", "Deep pothole near Barakhamba crossing",
                "A large pothole has formed near the Barakhamba Road crossing after rain.",
                "Opposite Statesman House", address, municipal.id, municipal.name, municipal.email, "in_progress",
                listOf(
                    TimelineEvent("submitted", older, "Complaint registered on CivicConnect India."),
                    TimelineEvent("email_sent", older, "Official complaint emailed to ${municipal.email}."),
                    TimelineEvent("acknowledged", older + 4 * 60 * 1000, "The civic body desk has acknowledged your complaint."),
                    TimelineEvent("in_progress", older + 8 * 60 * 1000, "A field team has been assigned and work is in progress.")
                ),
                older, older
            )
        )
        saveUsers()
        saveComplaints()
        prefs.edit().putBoolean("seeded", true).apply()
    }

    private fun hashPassword(password: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(password.toByteArray())
        return digest.joinToString("") { "%02x".format(it) }
    }

    private fun loadUsers() = decodeArray(prefs.getString("users", "[]")!!) { userFromJson(it) }.toMutableList()
    private fun loadComplaints() = decodeArray(prefs.getString("complaints", "[]")!!) { complaintFromJson(it) }.toMutableList()
    private fun loadDispatches() = decodeArray(prefs.getString("dispatches", "[]")!!) { dispatchFromJson(it) }.toMutableList()
    private fun loadOtp(): PendingOtp? {
        val raw = prefs.getString("otp", null) ?: return null
        val obj = JSONObject(raw)
        return PendingOtp(obj.getString("email"), obj.getString("otp"), obj.getLong("expiresAt"))
    }

    private fun saveUsers() = prefs.edit().putString("users", JSONArray(users.map { it.toJson() }).toString()).apply()
    private fun saveComplaints() = prefs.edit().putString("complaints", JSONArray(complaints.map { it.toJson() }).toString()).apply()
    private fun saveDispatches() = prefs.edit().putString("dispatches", JSONArray(dispatches.map { it.toJson() }).toString()).apply()
    private fun saveOtp() {
        val value = pendingOtp?.let {
            JSONObject().put("email", it.email).put("otp", it.otp).put("expiresAt", it.expiresAt).toString()
        }
        prefs.edit().putString("otp", value).apply()
    }

    private fun <T> decodeArray(raw: String, mapper: (JSONObject) -> T): List<T> {
        val array = JSONArray(raw)
        return buildList {
            for (i in 0 until array.length()) add(mapper(array.getJSONObject(i)))
        }
    }

    private fun Address.toJson() = JSONObject()
        .put("line1", line1).put("area", area).put("city", city).put("state", state).put("pincode", pincode)

    private fun addressFromJson(obj: JSONObject) = Address(
        obj.getString("line1"), obj.getString("area"), obj.getString("city"),
        obj.getString("state"), obj.getString("pincode")
    )

    private fun User.toJson() = JSONObject()
        .put("id", id).put("name", name).put("email", email).put("phone", phone)
        .put("passwordHash", passwordHash).put("address", address.toJson())
        .put("nearestBodyIds", JSONArray(nearestBodyIds))
        .put("emailVerified", emailVerified).put("createdAt", createdAt)

    private fun userFromJson(obj: JSONObject) = User(
        obj.getString("id"), obj.getString("name"), obj.getString("email"), obj.getString("phone"),
        obj.getString("passwordHash"), addressFromJson(obj.getJSONObject("address")),
        obj.getJSONArray("nearestBodyIds").let { ids -> List(ids.length()) { ids.getString(it) } },
        obj.getBoolean("emailVerified"), obj.getLong("createdAt")
    )

    private fun Complaint.toJson() = JSONObject()
        .put("id", id).put("trackingId", trackingId).put("userId", userId)
        .put("citizenName", citizenName).put("citizenEmail", citizenEmail).put("citizenPhone", citizenPhone)
        .put("categoryId", categoryId).put("title", title).put("description", description)
        .put("landmark", landmark).put("address", address.toJson())
        .put("civicBodyId", civicBodyId).put("civicBodyName", civicBodyName).put("civicBodyEmail", civicBodyEmail)
        .put("status", status).put("createdAt", createdAt).put("updatedAt", updatedAt)
        .put("timeline", JSONArray(timeline.map {
            JSONObject().put("status", it.status).put("at", it.at).put("note", it.note)
        }))

    private fun complaintFromJson(obj: JSONObject): Complaint {
        val events = obj.getJSONArray("timeline")
        return Complaint(
            obj.getString("id"), obj.getString("trackingId"), obj.getString("userId"),
            obj.getString("citizenName"), obj.getString("citizenEmail"), obj.getString("citizenPhone"),
            obj.getString("categoryId"), obj.getString("title"), obj.getString("description"),
            obj.optString("landmark"), addressFromJson(obj.getJSONObject("address")),
            obj.getString("civicBodyId"), obj.getString("civicBodyName"), obj.getString("civicBodyEmail"),
            obj.getString("status"),
            List(events.length()) {
                val item = events.getJSONObject(it)
                TimelineEvent(item.getString("status"), item.getLong("at"), item.getString("note"))
            },
            obj.getLong("createdAt"), obj.getLong("updatedAt")
        )
    }

    private fun EmailDispatch.toJson() = JSONObject()
        .put("id", id).put("complaintId", complaintId).put("trackingId", trackingId)
        .put("to", to).put("toName", toName).put("subject", subject).put("body", body).put("sentAt", sentAt)

    private fun dispatchFromJson(obj: JSONObject) = EmailDispatch(
        obj.getString("id"), obj.getString("complaintId"), obj.getString("trackingId"),
        obj.getString("to"), obj.getString("toName"), obj.getString("subject"),
        obj.getString("body"), obj.getLong("sentAt")
    )
}

class UnverifiedException(val email: String) : IllegalStateException("Verify the token before logging in.")
