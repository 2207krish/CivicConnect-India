package `in`.civicconnect.app.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import `in`.civicconnect.app.data.Address
import `in`.civicconnect.app.data.AppStore
import `in`.civicconnect.app.data.Complaint
import `in`.civicconnect.app.data.PendingOtp
import `in`.civicconnect.app.data.PendingPhoto
import `in`.civicconnect.app.data.UnverifiedException
import `in`.civicconnect.app.data.User
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class AppViewModelFactory(private val store: AppStore) : ViewModelProvider.Factory {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>): T = AppViewModel(store) as T
}

class AppViewModel(private val store: AppStore) : ViewModel() {
    var user by mutableStateOf(store.currentUser)
        private set
    var error by mutableStateOf<String?>(null)
    var pendingOtp by mutableStateOf<PendingOtp?>(store.pendingOtp)
        private set
    var lastComplaint by mutableStateOf<Complaint?>(null)
        private set
    var tick by mutableStateOf(0)
        private set
    var busy by mutableStateOf(false)
        private set
    var serverUrl by mutableStateOf(store.api.baseUrl)

    init {
        viewModelScope.launch {
            val remote = withContext(Dispatchers.IO) { store.syncSession() }
            if (remote != null) user = remote
        }
    }

    fun saveServerUrl(url: String) {
        store.api.baseUrl = url
        serverUrl = store.api.baseUrl
    }

    fun refresh() {
        viewModelScope.launch {
            val remote = withContext(Dispatchers.IO) { store.syncSession() }
            user = remote ?: store.currentUser
            pendingOtp = store.pendingOtp
            tick++
        }
    }

    fun register(
        name: String,
        email: String,
        phone: String,
        password: String,
        address: Address,
        onDone: (Boolean) -> Unit
    ) {
        viewModelScope.launch {
            busy = true
            error = null
            val result = withContext(Dispatchers.IO) { store.register(name, email, phone, password, address) }
            busy = false
            result.fold(
                onSuccess = {
                    pendingOtp = store.pendingOtp
                    onDone(true)
                },
                onFailure = {
                    error = it.message
                    onDone(false)
                }
            )
        }
    }

    fun login(email: String, password: String, onDone: (String?) -> Unit) {
        viewModelScope.launch {
            busy = true
            error = null
            val result = withContext(Dispatchers.IO) { store.login(email, password) }
            busy = false
            result.fold(
                onSuccess = {
                    user = it
                    onDone("ok")
                },
                onFailure = { failure ->
                    error = failure.message
                    onDone(if (failure is UnverifiedException) "unverified:${failure.email}" else "error")
                }
            )
        }
    }

    fun forgotPassword(email: String, onDone: (Boolean) -> Unit) {
        viewModelScope.launch {
            busy = true
            error = null
            val result = runCatching {
                withContext(Dispatchers.IO) { store.api.forgotPassword(email) }
            }
            busy = false
            result.fold(
                onSuccess = { onDone(true) },
                onFailure = {
                    error = it.message
                    onDone(false)
                }
            )
        }
    }

    fun sendFeedback(
        name: String,
        email: String,
        phone: String,
        topic: String,
        message: String,
        onDone: (String?) -> Unit
    ) {
        viewModelScope.launch {
            busy = true
            error = null
            val result = runCatching {
                withContext(Dispatchers.IO) {
                    store.api.sendFeedback(name, email, phone, topic, message)
                }
            }
            busy = false
            result.fold(
                onSuccess = { json ->
                    onDone(json.optString("message").ifBlank { "Thank you. Your feedback has been sent." })
                },
                onFailure = {
                    error = it.message
                    onDone(null)
                }
            )
        }
    }

    fun resetPassword(
        email: String,
        otp: String,
        password: String,
        confirmPassword: String,
        onDone: (Boolean) -> Unit
    ) {
        viewModelScope.launch {
            busy = true
            error = null
            val result = runCatching {
                withContext(Dispatchers.IO) {
                    store.api.resetPassword(email, otp, password, confirmPassword)
                }
            }
            busy = false
            result.fold(
                onSuccess = { onDone(true) },
                onFailure = {
                    error = it.message
                    onDone(false)
                }
            )
        }
    }

    fun verify(email: String, otp: String, onDone: (Boolean) -> Unit) {
        viewModelScope.launch {
            busy = true
            error = null
            val result = withContext(Dispatchers.IO) { store.verifyEmail(email, otp) }
            busy = false
            result.fold(
                onSuccess = {
                    user = it
                    pendingOtp = null
                    onDone(true)
                },
                onFailure = {
                    error = it.message
                    onDone(false)
                }
            )
        }
    }

    fun resend(email: String) {
        viewModelScope.launch {
            pendingOtp = withContext(Dispatchers.IO) { store.resendOtp(email) }
        }
    }

    fun loadInbox(email: String) {
        viewModelScope.launch {
            pendingOtp = withContext(Dispatchers.IO) { store.refreshInbox(email) }
        }
    }

    fun logout() {
        viewModelScope.launch {
            withContext(Dispatchers.IO) { store.logout() }
            user = null
        }
    }

    fun updateProfile(name: String, phone: String, address: Address) {
        viewModelScope.launch {
            busy = true
            error = null
            runCatching {
                withContext(Dispatchers.IO) { store.updateProfile(name, phone, address) }
            }.onSuccess {
                user = it
            }.onFailure {
                error = it.message
            }
            busy = false
        }
    }

    fun fileComplaint(
        categoryId: String,
        title: String,
        description: String,
        landmark: String,
        address: Address,
        photos: List<PendingPhoto> = emptyList(),
        onDone: (Complaint?) -> Unit
    ) {
        viewModelScope.launch {
            busy = true
            error = null
            val created = runCatching {
                withContext(Dispatchers.IO) {
                    store.createComplaint(categoryId, title, description, landmark, address, photos)
                }
            }.onFailure {
                error = it.message
            }.getOrNull()
            lastComplaint = created
            if (created != null) tick++
            busy = false
            onDone(created)
        }
    }

    fun complaints() = store.userComplaints()
    fun complaint(id: String) = store.complaintByTrackingId(id)
    fun dispatch(complaintId: String) = store.dispatchFor(complaintId)

    fun pullComplaints() {
        viewModelScope.launch {
            runCatching { withContext(Dispatchers.IO) { store.pullComplaints() } }
            tick++
        }
    }

    fun lookupComplaint(id: String, onDone: (Complaint?) -> Unit) {
        viewModelScope.launch {
            val found = runCatching {
                withContext(Dispatchers.IO) { store.pullComplaint(id) }
            }.getOrNull() ?: store.complaintByTrackingId(id)
            tick++
            onDone(found)
        }
    }

    fun resolve(id: String) {
        viewModelScope.launch {
            withContext(Dispatchers.IO) { store.confirmResolved(id) }
            refresh()
        }
    }
}
