package com.iqooistant

import android.content.Intent
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.tts.TextToSpeech
import android.os.Handler
import android.os.Looper
import java.util.Locale
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.modules.core.DeviceEventManagerModule

class CustomSpeechModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), RecognitionListener {
    private var speech: SpeechRecognizer? = null
    private var tts: TextToSpeech? = null
    private val mainHandler = Handler(Looper.getMainLooper())

    init {
        mainHandler.post {
            tts = TextToSpeech(reactContext) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    tts?.language = Locale.US
                }
            }
        }
    }

    override fun getName(): String {
        return "CustomSpeech"
    }

    @ReactMethod
    fun speak(text: String, promise: Promise) {
        mainHandler.post {
            try {
                tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, null)
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("TTS_ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun startListening(promise: Promise) {
        mainHandler.post {
            try {
                if (speech == null) {
                    speech = SpeechRecognizer.createSpeechRecognizer(reactApplicationContext)
                    speech?.setRecognitionListener(this)
                }
                val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH)
                intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                speech?.startListening(intent)
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("SPEECH_ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun stopListening(promise: Promise) {
        mainHandler.post {
            try {
                speech?.stopListening()
                promise.resolve(null)
            } catch (e: Exception) {
                promise.reject("SPEECH_ERROR", e.message)
            }
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Keep: Required for RN built-in Event Emitter Calls.
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Keep: Required for RN built-in Event Emitter Calls.
    }

    private fun sendEvent(eventName: String, params: String) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    override fun onReadyForSpeech(params: Bundle?) {}
    override fun onBeginningOfSpeech() { sendEvent("onSpeechStart", "") }
    override fun onRmsChanged(rmsdB: Float) {}
    override fun onBufferReceived(buffer: ByteArray?) {}
    override fun onEndOfSpeech() { sendEvent("onSpeechEnd", "") }
    override fun onError(error: Int) { sendEvent("onSpeechError", error.toString()) }
    
    override fun onResults(results: Bundle?) {
        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
        if (!matches.isNullOrEmpty()) {
            sendEvent("onSpeechResults", matches[0])
        }
    }
    
    override fun onPartialResults(partialResults: Bundle?) {
        val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
        if (!matches.isNullOrEmpty()) {
            sendEvent("onSpeechResults", matches[0])
        }
    }
    
    override fun onEvent(eventType: Int, params: Bundle?) {}
}
