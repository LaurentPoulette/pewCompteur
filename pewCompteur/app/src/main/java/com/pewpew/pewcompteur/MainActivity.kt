package com.pewpew.pewcompteur

import android.os.Bundle
import android.webkit.WebView
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import com.pewpew.pewcompteur.ui.theme.PewCompteurTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            PewCompteurTheme {
                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    WebViewScreen(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun WebViewScreen(modifier: Modifier = Modifier) {
    AndroidView(
        modifier = modifier.fillMaxSize(),
        factory = { context ->
            val assetLoader = WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(context))
                .build()

            WebView(context).apply {
                webViewClient = object : WebViewClientCompat() {
                    override fun shouldInterceptRequest(
                        view: WebView,
                        request: android.webkit.WebResourceRequest
                    ) = assetLoader.shouldInterceptRequest(request.url)
                }
                settings.javaScriptEnabled = true
                settings.domStorageEnabled = true
                loadUrl("https://appassets.androidplatform.net/assets/index.html")
            }
        }
    )
}
