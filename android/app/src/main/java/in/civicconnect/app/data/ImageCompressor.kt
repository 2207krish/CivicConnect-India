package `in`.civicconnect.app.data

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import java.io.ByteArrayOutputStream
import kotlin.math.max
import kotlin.math.roundToInt

data class PendingPhoto(val name: String, val dataUrl: String, val bytes: Int)

object ImageCompressor {
    const val MAX_BYTES = 200 * 1024
    private const val MAX_EDGE = 1600

    fun compress(context: Context, uri: Uri): PendingPhoto {
        val original = context.contentResolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it) }
            ?: throw IllegalStateException("Could not read this photo.")
        var bitmap = scale(original)
        if (bitmap !== original) original.recycle()

        var quality = 82
        var bytes = jpeg(bitmap, quality)
        while (bytes.size > MAX_BYTES && quality > 38) {
            quality -= 8
            bytes = jpeg(bitmap, quality)
        }
        while (bytes.size > MAX_BYTES && max(bitmap.width, bitmap.height) > 640) {
            val next = Bitmap.createScaledBitmap(
                bitmap,
                (bitmap.width * 0.82f).roundToInt().coerceAtLeast(1),
                (bitmap.height * 0.82f).roundToInt().coerceAtLeast(1),
                true
            )
            if (next !== bitmap) bitmap.recycle()
            bitmap = next
            bytes = jpeg(bitmap, quality)
        }
        bitmap.recycle()
        if (bytes.size > MAX_BYTES) {
            throw IllegalStateException("This photo could not be compressed under 200 KB.")
        }
        val dataUrl = "data:image/jpeg;base64," + Base64.encodeToString(bytes, Base64.NO_WRAP)
        return PendingPhoto("photo.jpg", dataUrl, bytes.size)
    }

    private fun scale(src: Bitmap): Bitmap {
        val longest = max(src.width, src.height)
        if (longest <= MAX_EDGE) return src
        val factor = MAX_EDGE.toFloat() / longest
        return Bitmap.createScaledBitmap(
            src,
            (src.width * factor).roundToInt().coerceAtLeast(1),
            (src.height * factor).roundToInt().coerceAtLeast(1),
            true
        )
    }

    private fun jpeg(bitmap: Bitmap, quality: Int): ByteArray {
        val out = ByteArrayOutputStream()
        bitmap.compress(Bitmap.CompressFormat.JPEG, quality, out)
        return out.toByteArray()
    }
}
