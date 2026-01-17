package com.pewpew.pewcompteur

import android.app.AlertDialog
import android.os.Bundle
import android.webkit.JavascriptInterface
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
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import com.pewpew.pewcompteur.ui.theme.PewCompteurTheme
import org.json.JSONObject

class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView

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
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

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
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
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
            .setMessage("Voulez-vous vraiment quitter l'application ?")
            .setPositiveButton("Oui") { _, _ -> finish() }
            .setNegativeButton("Non", null)
            .show()
    }
}
