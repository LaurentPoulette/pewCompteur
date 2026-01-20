package com.pewpew.pewcompteur

import android.app.AlertDialog
import android.content.Intent
import android.content.pm.PackageManager
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
                
                override fun onPageFinished(view: WebView?, url: String?) {
                    super.onPageFinished(view, url)
                    val versionName = packageManager.getPackageInfo(packageName, 0).versionName
                    view?.evaluateJavascript("window.APP_VERSION_NATIVE = '$versionName';", null)
                }
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
            // Add the interface
            addJavascriptInterface(WebAppInterface(), "Android")
            loadUrl("https://appassets.androidplatform.net/assets/index.html")
        }

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
}