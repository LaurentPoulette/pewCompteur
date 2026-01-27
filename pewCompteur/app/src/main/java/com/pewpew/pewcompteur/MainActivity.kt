package com.pewpew.pewcompteur

import android.app.AlertDialog
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.addCallback
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import com.pewpew.pewcompteur.ui.theme.PewCompteurTheme
import org.json.JSONObject
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.net.URL

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private var cameraPermissionRequest: PermissionRequest? = null
    private lateinit var permissionLauncher: ActivityResultLauncher<String>

    // The Javascript Interface class
    inner class WebAppInterface {
        @JavascriptInterface
        fun handleBackButtonState(stateJson: String) {
            runOnUiThread {
                val json = JSONObject(stateJson)
                val historySize = json.getInt("history")
                val pageName = json.getString("page")

                when {
                    // On score page, ask to end current game.
                    pageName == "game" -> {
                        webView.evaluateJavascript("window.app.navigateCancelGame();", null)
                    }
                    // If there is a back-stack in the web app, go back.
                    historySize > 1 -> {
                        webView.evaluateJavascript("window.app.router.back();", null)
                    }
                    // On the home page (or if history is 1), ask to quit the app.
                    else -> {
                        showQuitConfirmationDialog()
                    }
                }
            }
        }

        @JavascriptInterface
        fun shareText(title: String, text: String) {
            runOnUiThread {
                val sendIntent = Intent().apply {
                    action = Intent.ACTION_SEND
                    putExtra(Intent.EXTRA_TITLE, title)
                    putExtra(Intent.EXTRA_TEXT, text)
                    type = "text/plain"
                }
                val shareIntent = Intent.createChooser(sendIntent, title)
                startActivity(shareIntent)
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        permissionLauncher = registerForActivityResult(ActivityResultContracts.RequestPermission()) { isGranted: Boolean ->
            if (isGranted) {
                cameraPermissionRequest?.grant(cameraPermissionRequest?.resources)
            } else {
                cameraPermissionRequest?.deny()
            }
            cameraPermissionRequest = null
        }

        webView = WebView(this).apply {
            val assetLoader = WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context))
                .build()

            webViewClient = object : WebViewClientCompat() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: android.webkit.WebResourceRequest
                ) = assetLoader.shouldInterceptRequest(request.url)
            }
            
            webChromeClient = object : WebChromeClient() {
                override fun onPermissionRequest(request: PermissionRequest) {
                    // Check if the requested resources include camera access
                    if (request.resources.any { it == PermissionRequest.RESOURCE_VIDEO_CAPTURE }) {
                        // Check if Android app has camera permission
                        if (ContextCompat.checkSelfPermission(this@MainActivity, android.Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED) {
                            request.grant(request.resources)
                        } else {
                            // Store the request and ask for runtime permission
                            cameraPermissionRequest = request
                            permissionLauncher.launch(android.Manifest.permission.CAMERA)
                        }
                    }
                    else {
                        request.deny()
                    }
                }
            }

            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.mediaPlaybackRequiresUserGesture = false // Allow autoplay for camera stream
            
            // Inject version before loading the page
            val versionName = packageManager.getPackageInfo(packageName, 0).versionName
            evaluateJavascript("window.APP_VERSION_NATIVE = '$versionName';", null)
            
            // Add the interface
            addJavascriptInterface(WebAppInterface(), "Android")
            loadUrl("https://appassets.androidplatform.net/assets/index.html")
        }

        // Vérifier la version au démarrage
        checkVersion()

        onBackPressedDispatcher.addCallback(this) {
            // This now calls a global JS function that will call back into our interface.
            webView.evaluateJavascript("window.requestBackAction();", null)
        }

        setContent {
            PewCompteurTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    AndroidView(
                        factory = { webView },
                        modifier = Modifier.padding(innerPadding).fillMaxSize()
                    )
                }
            }
        }
    }

    private fun showQuitConfirmationDialog() {
        AlertDialog.Builder(this@MainActivity)
            .setTitle("Quitter")
            .setMessage("Voulez-vous vraiment quitter l\'application ?")
            .setPositiveButton("Oui") { _, _ -> finish() }
            .setNegativeButton("Non", null)
            .show()
    }

    private fun checkVersion() {
        val currentVersion = packageManager.getPackageInfo(packageName, 0).versionName ?: return
        
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val url = URL("https://sites.google.com/view/apps-pewpew/accueil/pewcompteur/version")
                val html = url.readText()
                
                // Rechercher "Version actuelle : x.y" dans le HTML
                val regex = Regex("Version actuelle\\s*:\\s*([\\d.]+)", RegexOption.IGNORE_CASE)
                val match = regex.find(html)
                
                withContext(Dispatchers.Main) {
                    if (match != null) {
                        val remoteVersion = match.groupValues[1]
                        
                        // Comparer les versions
                        if (isVersionGreater(remoteVersion, currentVersion)) {
                            // Nouvelle version disponible
                            AlertDialog.Builder(this@MainActivity)
                                .setIcon(R.mipmap.ic_launcher)
                                .setTitle("🎉 Mise à jour disponible")
                                .setMessage("Une nouvelle version ($remoteVersion) est disponible !\n\nVersion actuelle : $currentVersion\nNouvelle version : $remoteVersion\n\nVoulez-vous mettre à jour l'application ?")
                                .setPositiveButton("Mettre à jour") { _, _ ->
                                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=com.pewpew.pewcompteur"))
                                    startActivity(intent)
                                }
                                .setNegativeButton("Plus tard", null)
                                .setCancelable(true)
                                .show()
                        }
                        // Si la version est à jour, ne rien afficher
                    }
                }
            } catch (e: Exception) {
                android.util.Log.e("MainActivity", "Erreur lors de la vérification de version", e)
            }
        }
    }
    
    private fun isVersionGreater(version1: String, version2: String): Boolean {
        val parts1 = version1.split(".").map { it.toIntOrNull() ?: 0 }
        val parts2 = version2.split(".").map { it.toIntOrNull() ?: 0 }
        
        val maxLength = maxOf(parts1.size, parts2.size)
        for (i in 0 until maxLength) {
            val v1 = parts1.getOrNull(i) ?: 0
            val v2 = parts2.getOrNull(i) ?: 0
            if (v1 > v2) return true
            if (v1 < v2) return false
        }
        return false
    }
}