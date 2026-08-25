package `in`.civicconnect.app.data

data class Address(
    val line1: String,
    val area: String,
    val city: String,
    val state: String,
    val pincode: String
) {
    fun formatted(): String = listOf(line1, area, city, state, pincode)
        .filter { it.isNotBlank() }
        .joinToString(", ")
}

data class CivicBody(
    val id: String,
    val name: String,
    val shortName: String,
    val type: String,
    val departments: List<String>,
    val address: String,
    val city: String,
    val state: String,
    val pincode: String,
    val pincodePrefixes: List<String>,
    val email: String,
    val phone: String,
    val lat: Double,
    val lng: Double,
    val officeHours: String = "Mon–Sat, 10:00 AM – 5:00 PM"
)

data class MatchedCivicBody(
    val body: CivicBody,
    val score: Int,
    val distanceKm: Double?,
    val matchReasons: List<String>
)

data class User(
    val id: String,
    val name: String,
    val email: String,
    val phone: String,
    val passwordHash: String,
    val address: Address,
    val nearestBodyIds: List<String>,
    val emailVerified: Boolean,
    val createdAt: Long
)

data class TimelineEvent(
    val status: String,
    val at: Long,
    val note: String
)

data class ComplaintPhoto(
    val name: String,
    val url: String,
    val bytes: Int = 0
)

data class Complaint(
    val id: String,
    val trackingId: String,
    val userId: String,
    val citizenName: String,
    val citizenEmail: String,
    val citizenPhone: String,
    val categoryId: String,
    val title: String,
    val description: String,
    val landmark: String,
    val address: Address,
    val civicBodyId: String,
    val civicBodyName: String,
    val civicBodyEmail: String,
    val status: String,
    val timeline: List<TimelineEvent>,
    val createdAt: Long,
    val updatedAt: Long,
    val photos: List<ComplaintPhoto> = emptyList()
)

data class EmailDispatch(
    val id: String,
    val complaintId: String,
    val trackingId: String,
    val to: String,
    val toName: String,
    val subject: String,
    val body: String,
    val sentAt: Long
)

data class PendingOtp(
    val email: String,
    val otp: String,
    val expiresAt: Long
)

data class Category(
    val id: String,
    val title: String,
    val description: String,
    val department: String,
    val image: String
)

object AppMedia {
    private fun unsplash(id: String) =
        "https://images.unsplash.com/$id?auto=format&fit=crop&w=1200&q=80"

    val hero = unsplash("photo-1587474260584-13657470ed2c")
    val gateway = unsplash("photo-1524492412937-b28074a5d7da")
    val jaipur = unsplash("photo-1477587458883-47145ed94245")
    val mumbai = unsplash("photo-1570168007204-dfb528c6958f")
    val traffic = unsplash("photo-1532664189809-02133fee698d")
    val night = unsplash("photo-1519501025264-65ba15a82390")
    val water = unsplash("photo-1548839140-29a749e1cf4d")
    val park = unsplash("photo-1585938389612-a552a28d6914")
    val road = unsplash("photo-1465447142348-e9952c393450")
    val power = unsplash("photo-1473341304170-971dccb5ac1e")
    val city = unsplash("photo-1449824913935-59a10b8d2000")
}

val categories = listOf(
    Category("roads", "Roads & Potholes", "Broken roads, potholes, missing signage", "roads", AppMedia.road),
    Category("electricity", "Electricity", "Power cuts, snapped lines, transformer issues", "electricity", AppMedia.power),
    Category("sanitation", "Sanitation & Drainage", "Open drains, sewage overflow, blocked gutters", "sanitation", AppMedia.mumbai),
    Category("water", "Water Supply", "Leakage, no supply, contaminated water", "water", AppMedia.water),
    Category("garbage", "Garbage & Waste", "Uncollected waste, dumping, overflowing bins", "garbage", AppMedia.city),
    Category("street_lights", "Street Lights", "Dark stretches, damaged poles, flickering lights", "street_lights", AppMedia.night),
    Category("parks", "Parks & Open Spaces", "Neglected parks, broken benches, unsafe play areas", "parks", AppMedia.park),
    Category("stray_animals", "Stray Animals", "Injured animals, aggressive packs, carcass removal", "stray_animals", AppMedia.park),
    Category("traffic", "Traffic Issues", "Faulty signals, illegal parking, congestion points", "traffic", AppMedia.traffic),
    Category("public_property", "Public Property", "Damaged footpaths, bus stops, government buildings", "public_property", AppMedia.hero)
)

fun categoryById(id: String) = categories.find { it.id == id }

val indianStates = listOf(
    "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat",
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
    "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Chandigarh"
)

val citiesByState = mapOf(
    "Delhi" to listOf("New Delhi", "Delhi", "Dwarka", "Rohini", "Saket"),
    "Maharashtra" to listOf("Mumbai", "Pune", "Nagpur", "Thane", "Nashik"),
    "Karnataka" to listOf("Bengaluru", "Mysuru", "Mangaluru", "Hubballi"),
    "Tamil Nadu" to listOf("Chennai", "Coimbatore", "Madurai"),
    "West Bengal" to listOf("Kolkata", "Howrah", "Siliguri"),
    "Telangana" to listOf("Hyderabad", "Warangal", "Secunderabad"),
    "Gujarat" to listOf("Ahmedabad", "Surat", "Vadodara"),
    "Rajasthan" to listOf("Jaipur", "Jodhpur", "Udaipur"),
    "Uttar Pradesh" to listOf("Lucknow", "Kanpur", "Varanasi", "Noida"),
    "Madhya Pradesh" to listOf("Bhopal", "Indore", "Jabalpur"),
    "Chandigarh" to listOf("Chandigarh"),
    "Kerala" to listOf("Kochi", "Thiruvananthapuram"),
    "Bihar" to listOf("Patna", "Gaya"),
    "Odisha" to listOf("Bhubaneswar", "Cuttack"),
    "Assam" to listOf("Guwahati"),
    "Andhra Pradesh" to listOf("Visakhapatnam", "Vijayawada")
)

val pincodeDirectory = mapOf(
    "110001" to Triple("Connaught Place", "New Delhi", "Delhi"),
    "110002" to Triple("Darya Ganj", "New Delhi", "Delhi"),
    "110017" to Triple("Malviya Nagar", "New Delhi", "Delhi"),
    "400001" to Triple("Fort", "Mumbai", "Maharashtra"),
    "400053" to Triple("Andheri", "Mumbai", "Maharashtra"),
    "411001" to Triple("Pune Camp", "Pune", "Maharashtra"),
    "440001" to Triple("Sitabuldi", "Nagpur", "Maharashtra"),
    "560001" to Triple("MG Road", "Bengaluru", "Karnataka"),
    "600001" to Triple("Parrys Corner", "Chennai", "Tamil Nadu"),
    "700001" to Triple("BBD Bagh", "Kolkata", "West Bengal"),
    "500001" to Triple("Abids", "Hyderabad", "Telangana"),
    "380001" to Triple("Lal Darwaza", "Ahmedabad", "Gujarat"),
    "395001" to Triple("Chowk Bazar", "Surat", "Gujarat"),
    "302001" to Triple("Johari Bazaar", "Jaipur", "Rajasthan"),
    "226001" to Triple("Hazratganj", "Lucknow", "Uttar Pradesh"),
    "462001" to Triple("TT Nagar", "Bhopal", "Madhya Pradesh"),
    "452001" to Triple("Rajwada", "Indore", "Madhya Pradesh"),
    "160017" to Triple("Sector 17", "Chandigarh", "Chandigarh"),
    "682001" to Triple("Fort Kochi", "Kochi", "Kerala"),
    "800001" to Triple("Gandhi Maidan", "Patna", "Bihar"),
    "751001" to Triple("Unit 1", "Bhubaneswar", "Odisha"),
    "781001" to Triple("Pan Bazaar", "Guwahati", "Assam"),
    "530001" to Triple("Old Town", "Visakhapatnam", "Andhra Pradesh")
)

val cityCoords = mapOf(
    "New Delhi" to (28.6139 to 77.2090),
    "Delhi" to (28.7041 to 77.1025),
    "Mumbai" to (19.0760 to 72.8777),
    "Pune" to (18.5204 to 73.8567),
    "Nagpur" to (21.1458 to 79.0882),
    "Bengaluru" to (12.9716 to 77.5946),
    "Chennai" to (13.0827 to 80.2707),
    "Kolkata" to (22.5726 to 88.3639),
    "Hyderabad" to (17.3850 to 78.4867),
    "Ahmedabad" to (23.0225 to 72.5714),
    "Surat" to (21.1702 to 72.8311),
    "Jaipur" to (26.9124 to 75.7873),
    "Lucknow" to (26.8467 to 80.9462),
    "Bhopal" to (23.2599 to 77.4126),
    "Indore" to (22.7196 to 75.8577),
    "Chandigarh" to (30.7333 to 76.7794),
    "Kochi" to (9.9312 to 76.2673),
    "Patna" to (25.5941 to 85.1376),
    "Bhubaneswar" to (20.2961 to 85.8245),
    "Guwahati" to (26.1445 to 91.7362),
    "Visakhapatnam" to (17.6868 to 83.2185)
)

fun statusLabel(status: String) = when (status) {
    "submitted" -> "Submitted"
    "email_sent" -> "Emailed to civic body"
    "acknowledged" -> "Acknowledged"
    "in_progress" -> "In progress"
    "resolved" -> "Resolved"
    "rejected" -> "Rejected"
    else -> status
}
