package `in`.civicconnect.app.ui

import `in`.civicconnect.app.data.Address

object Validators {
    fun name(value: String) = when {
        value.trim().length < 3 -> "Enter your full name"
        else -> null
    }

    fun email(value: String) = when {
        !value.trim().matches(Regex("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) -> "Enter a valid email address"
        else -> null
    }

    fun phone(value: String) = when {
        !value.trim().matches(Regex("^[6-9]\\d{9}$")) -> "Enter a valid 10-digit mobile number"
        else -> null
    }

    fun optionalPhone(value: String) = if (value.isBlank()) null else phone(value)

    fun feedbackMessage(value: String) =
        if (value.trim().length < 12) "Please describe the issue or change in more detail" else null

    fun password(value: String) = when {
        value.length < 8 -> "Password must be at least 8 characters"
        value.none { it.isUpperCase() } -> "Include one uppercase letter"
        value.none { it.isDigit() } -> "Include one number"
        else -> null
    }

    fun confirmPassword(password: String, confirm: String) =
        if (password != confirm) "Passwords do not match" else null

    fun title(value: String) = if (value.trim().length < 8) "Give the issue a short title" else null

    fun description(value: String) =
        if (value.trim().length < 20) "Describe the problem in at least 20 characters" else null

    fun otp(value: String) = if (!value.matches(Regex("^\\d{6}$"))) "Enter the 6-digit token" else null

    fun address(value: Address): String? = when {
        value.line1.trim().length < 5 -> "Enter your house or street address"
        value.area.trim().length < 2 -> "Enter your locality or area"
        value.city.trim().length < 2 -> "Enter your city"
        value.state.trim().length < 2 -> "Select your state"
        !value.pincode.matches(Regex("^[1-9][0-9]{5}$")) -> "Enter a valid 6-digit PIN code"
        else -> null
    }
}
