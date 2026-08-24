package `in`.civicconnect.app.data

import kotlin.math.asin
import kotlin.math.cos
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.sqrt

private fun haversineKm(lat1: Double, lon1: Double, lat2: Double, lon2: Double): Double {
    val earth = 6371.0
    val dLat = Math.toRadians(lat2 - lat1)
    val dLon = Math.toRadians(lon2 - lon1)
    val a = sin(dLat / 2).pow(2) +
        cos(Math.toRadians(lat1)) * cos(Math.toRadians(lat2)) * sin(dLon / 2).pow(2)
    return 2 * earth * asin(sqrt(a))
}

private fun scoreBody(body: CivicBody, address: Address, department: String?): MatchedCivicBody {
    var score = 0
    val reasons = mutableListOf<String>()
    val coords = cityCoords[address.city] ?: cityCoords.entries.find {
        it.key.equals(address.city, true)
    }?.value
    val prefix = address.pincode.take(3)

    if (department != null && body.departments.contains(department)) {
        score += 30
        reasons += "Handles this complaint type"
    }
    if (body.pincode == address.pincode) {
        score += 100
        reasons += "Exact PIN code match"
    } else if (body.pincodePrefixes.contains(prefix)) {
        score += 55
        reasons += "Same postal circle"
    }
    if (body.city.equals(address.city.trim(), true)) {
        score += 40
        reasons += "Same city"
    } else if (body.state.equals(address.state.trim(), true)) {
        score += 12
        reasons += "Same state"
    }

    var distance: Double? = null
    if (coords != null) {
        distance = String.format("%.1f", haversineKm(coords.first, coords.second, body.lat, body.lng)).toDouble()
        score += maxOf(0, 25 - min(25.0, distance).toInt())
        if (distance <= 8) reasons += "About $distance km from your locality"
    }
    return MatchedCivicBody(body, score, distance, reasons)
}

fun findNearestBodies(address: Address, department: String? = null, limit: Int = 4): List<MatchedCivicBody> {
    val ranked = civicBodies
        .filter { department == null || it.departments.contains(department) }
        .map { scoreBody(it, address, department) }
        .sortedWith(compareByDescending<MatchedCivicBody> { it.score }.thenBy { it.distanceKm ?: 9999.0 })
    val pool = ranked.filter { it.score >= 40 }.ifEmpty { ranked }
    val unique = linkedMapOf<String, MatchedCivicBody>()
    pool.forEach { if (!unique.containsKey(it.body.type)) unique[it.body.type] = it }
    return unique.values.take(limit)
}

fun findBestBodyForDepartment(address: Address, department: String) =
    findNearestBodies(address, department, 1).firstOrNull()

fun assignHomeCivicBodies(address: Address): List<MatchedCivicBody> {
    val matches = listOfNotNull(
        findBestBodyForDepartment(address, "roads"),
        findBestBodyForDepartment(address, "electricity"),
        findBestBodyForDepartment(address, "water"),
        findBestBodyForDepartment(address, "traffic")
    )
    return matches.distinctBy { it.body.id }
}
