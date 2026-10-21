import React, { useState } from 'react';
import {
  Crown,
  Shield,
  Code2,
  Terminal,
  Settings2,
  Cpu,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Smartphone,
  ChevronRight,
} from 'lucide-react';
import { sound } from '../utils/audio';

export const ProfileView: React.FC<{ onNavigateRoute?: (route: string) => void }> = ({ onNavigateRoute }) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'dashboardScreen' | 'chatScreen' | 'mainActivity' | 'theme' | 'manifest' | 'gradle'>('chatScreen');
  const [showCode, setShowCode] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const chatScreenSnippet = `package com.riyaz.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.riyaz.ai.ui.theme.*

data class ChatMessage(val text: String, val isUser: Boolean)

@Composable
fun AIChatScreen(navController: NavController) {
    var userText by remember { mutableStateOf("") }
    val messages = remember { mutableStateListOf(
        ChatMessage("Assalam o Alaikum Abu! Main Riyaz AI hoon. Aaj main aap ki کیا madad karoon?", false)
    ) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBackground)
            .padding(16.dp)
    ) {
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text("RIYAZ AI Engine", style = MaterialTheme.typography.titleLarge, color = NeonCyan)
            TextButton(onClick = { navController.popBackStack() }) {
                Text("Back", color = TextGraySecondary)
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            modifier = Modifier.weight(1f).fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(messages) { msg ->
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = if (msg.isUser) Alignment.CenterEnd else Alignment.CenterStart
                ) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = if (msg.isUser) NeonPurple else CardSurfaceDark,
                        modifier = Modifier.widthIn(max = 280.dp)
                    ) {
                        Text(
                            text = msg.text,
                            color = TextWhitePrimary,
                            modifier = Modifier.padding(12.dp),
                            style = MaterialTheme.typography.bodyMedium
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = userText,
                onValueChange = { userText = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Type in Roman Urdu or English...", color = TextGraySecondary) },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = NeonCyan,
                    unfocusedBorderColor = SubtleBorderColor,
                    focusedTextColor = TextWhitePrimary,
                    unfocusedTextColor = TextWhitePrimary
                )
            )
            Button(
                onClick = {
                    if (userText.isNotBlank()) {
                        messages.add(ChatMessage(userText, true))
                        val currentPrompt = userText
                        userText = ""
                        messages.add(ChatMessage("Gemini processing: $currentPrompt", false))
                    }
                },
                colors = ButtonDefaults.buttonColors(containerColor = NeonCyan)
            ) {
                Text("Send", color = DarkNavyBackground)
            }
        }
    }
}`;

  const dashboardScreenSnippet = `package com.riyaz.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.riyaz.ai.ui.theme.*

@Composable
fun HomeDashboardScreen(navController: NavController) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkNavyBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Column {
                Text("Assalam o Alaikum, Abu!", style = MaterialTheme.typography.headlineMedium, color = TextWhitePrimary)
                Text("RIYAZ AI — Your Personal AI Agent", style = MaterialTheme.typography.bodyMedium, color = NeonCyan)
            }
        }

        // Animated Central Voice Orb Card
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
                    .clickable { navController.navigate("voice") },
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurfaceDark)
            ) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Box(
                            modifier = Modifier
                                .size(80.dp)
                                .clip(CircleShape)
                                .background(NeonCyan)
                                .border(2.dp, NeonPurple, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("🎙️", style = MaterialTheme.typography.headlineLarge)
                        }
                        Spacer(modifier = Modifier.height(12.dp))
                        Text("Tap to Speak with AI", color = NeonCyan, style = MaterialTheme.typography.titleMedium)
                        Text("Urdu, Roman Urdu & English Supported", color = TextGraySecondary, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }

        // Quick Grid Shortcut Cards
        item {
            Text("AI Modules Engine", style = MaterialTheme.typography.titleMedium, color = TextWhitePrimary)
            Spacer(modifier = Modifier.height(8.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                DashboardCard("WhatsApp Agent", "💬", modifier = Modifier.weight(1f)) { navController.navigate("whatsapp") }
                DashboardCard("Social Media", "🌐", modifier = Modifier.weight(1f)) { navController.navigate("social") }
            }
            Spacer(modifier = Modifier.height(10.dp))
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                DashboardCard("Phone Control", "📱", modifier = Modifier.weight(1f)) { navController.navigate("phone") }
                DashboardCard("AI Chat Engine", "🤖", modifier = Modifier.weight(1f)) { navController.navigate("chat") }
            }
        }

        // System Health Status
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = CardSurfaceDark)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("System Status", color = NeonPurple, style = MaterialTheme.typography.titleSmall)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("• Gemini 3.8 Flash Engine: Connected & Active", color = TextWhitePrimary, style = MaterialTheme.typography.bodySmall)
                    Text("• Background Service: Active", color = TextWhitePrimary, style = MaterialTheme.typography.bodySmall)
                    Text("• Permissions: Configured", color = TextWhitePrimary, style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}

@Composable
fun DashboardCard(title: String, icon: String, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Card(
        modifier = modifier
            .height(100.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = CardSurfaceDark)
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(12.dp),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(icon, style = MaterialTheme.typography.titleLarge)
            Spacer(modifier = Modifier.height(6.dp))
            Text(title, color = TextWhitePrimary, style = MaterialTheme.typography.bodyMedium)
        }
    }
}`;

  const mainActivitySnippet = `package com.riyaz.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.riyaz.ai.ui.screens.*
import com.riyaz.ai.ui.theme.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            RiyazAIAppTheme {
                val navController = rememberNavController()
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    containerColor = DarkNavyBackground
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "dashboard",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("dashboard") { HomeDashboardScreen(navController) }
                        composable("chat") { AIChatScreen(navController) }
                        composable("voice") { VoiceAssistantScreen(navController) }
                        composable("whatsapp") { WhatsAppAssistantScreen(navController) }
                        composable("social") { SocialMediaScreen(navController) }
                        composable("phone") { PhoneControlScreen(navController) }
                        composable("tasks") { TaskManagerScreen(navController) }
                        composable("permissions") { PermissionsScreen(navController) }
                        composable("settings") { SettingsScreen(navController) }
                    }
                }
            }
        }
    }
}

@Composable
fun RiyazAIAppTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            background = DarkNavyBackground,
            surface = CardSurfaceDark,
            primary = NeonCyan,
            secondary = NeonPurple
        ),
        content = content
    )
}`;

  const themeSnippet = `package com.riyaz.ai.ui.theme

import androidx.compose.ui.graphics.Color

val DarkNavyBackground = Color(0xFF070913)
val CardSurfaceDark = Color(0xFF111524)
val NeonCyan = Color(0xFF00F0FF)
val NeonPurple = Color(0xFF8A00FF)
val NeonMagenta = Color(0xFFFF007F)
val TextWhitePrimary = Color(0xFFFFFFFF)
val TextGraySecondary = Color(0xFF8E9BAE)
val SubtleBorderColor = Color(0xFF1E283D)`;

  const manifestSnippet = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/app/xml"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.riyaz.ai">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
    <uses-permission android:name="android.permission.CALL_PHONE" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="RIYAZ AI"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoTitleBar">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;

  const gradleSnippet = `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.riyaz.ai"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.riyaz.ai"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.2.0")
    implementation("androidx.navigation:navigation-compose:2.7.7")
    implementation("androidx.work:work-runtime-ktx:2.9.0")
    
    // Gemini SDK Integration
    implementation("com.google.ai.client.generativeai:generativeai:0.3.0")
}`;

  const themeTokens = [
    { name: 'DarkNavyBackground', hex: '#070913', role: 'Main App Surface Background' },
    { name: 'CardSurfaceDark', hex: '#111524', role: 'Elevated Card & Dialog Surface' },
    { name: 'NeonCyan', hex: '#00F0FF', role: 'Primary Accent & Hologram Core' },
    { name: 'NeonPurple', hex: '#8A00FF', role: 'AI Brain & Secondary Gradient' },
    { name: 'NeonMagenta', hex: '#FF007F', role: 'Accent Flare & Dynamic Rings' },
    { name: 'TextWhitePrimary', hex: '#FFFFFF', role: 'Primary Titles & High Contrast Text' },
    { name: 'TextGraySecondary', hex: '#8E9BAE', role: 'Subtitles, Labels & Metadata' },
    { name: 'SubtleBorderColor', hex: '#1E283D', role: 'Outlines & Card Dividers' },
  ];

  const handleCopyCode = () => {
    const code =
      activeCodeTab === 'chatScreen'
        ? chatScreenSnippet
        : activeCodeTab === 'dashboardScreen'
        ? dashboardScreenSnippet
        : activeCodeTab === 'mainActivity'
        ? mainActivitySnippet
        : activeCodeTab === 'theme'
        ? themeSnippet
        : activeCodeTab === 'manifest'
        ? manifestSnippet
        : gradleSnippet;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    sound.playSuccess();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    sound.playChirp();
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const declaredPermissions = [
    {
      id: 'INTERNET',
      label: 'android.permission.INTERNET',
      purpose: 'Connects to Gemini 3.8 Flash API endpoints and synchronizes tasks',
      granted: true,
    },
    {
      id: 'RECORD_AUDIO',
      label: 'android.permission.RECORD_AUDIO',
      purpose: 'Voice companion, wake word, and real-time speech-to-text processing',
      granted: true,
    },
    {
      id: 'POST_NOTIFICATIONS',
      label: 'android.permission.POST_NOTIFICATIONS',
      purpose: 'Dispatches background WorkManager summaries and smart reply notifications',
      granted: true,
    },
    {
      id: 'RECEIVE_BOOT_COMPLETED',
      label: 'android.permission.RECEIVE_BOOT_COMPLETED',
      purpose: 'Automatically restarts scheduled AI text routines upon device reboot',
      granted: true,
    },
    {
      id: 'CALL_PHONE',
      label: 'android.permission.CALL_PHONE',
      purpose: 'Enables 1-tap call actions and voice-initiated dialing assistance',
      granted: true,
    },
    {
      id: 'READ_CONTACTS',
      label: 'android.permission.READ_CONTACTS',
      purpose: 'Personalizes SMS/WhatsApp message tone using saved contact relationships',
      granted: true,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-[#040816] select-none text-slate-100 overflow-y-auto p-4 space-y-4">
      {/* Profile Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0a1538] to-slate-900 border border-cyan-500/30 flex items-center gap-3.5 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
        <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-fuchsia-500 p-0.5">
          <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-400">
              R
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
            <Crown className="w-3 h-3 fill-slate-950" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-wide truncate">
              Riyaz AI Master
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 flex items-center gap-1 shadow-[0_0_10px_rgba(251,191,36,0.5)]">
              <Crown className="w-2.5 h-2.5 fill-slate-950" /> PRO
            </span>
          </div>
          <p className="text-xs text-cyan-300 mt-0.5">aiflex5544@gmail.com</p>
          <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-2">
            <span>Namespace: com.riyaz.ai</span>
            <span>•</span>
            <span className="text-emerald-400">SDK 34 (Android 14)</span>
          </div>
        </div>
      </div>

      {/* Gemini Engine Telemetry */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/25 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white">Gemini AI Model Engine</span>
          </div>
          <span className="text-[10px] font-semibold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
            gemini-3.8-flash
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Active text processing engine initialized via Google GenAI TypeScript SDK with server-side proxy security. Capable of high-speed reasoning, multilingual translation (Urdu/English), tone styling, and image OCR.
        </p>
      </div>

      {/* Android Architecture: Manifest & Gradle Code Viewers */}
      <div className="rounded-2xl bg-slate-900/80 border border-cyan-500/25 overflow-hidden">
        <div className="p-3.5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Android Architecture Files</span>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                sound.playChirp();
                setActiveCodeTab('chatScreen');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeCodeTab === 'chatScreen'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AIChatScreen.kt
            </button>
            <button
              onClick={() => {
                sound.playChirp();
                setActiveCodeTab('dashboardScreen');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeCodeTab === 'dashboardScreen'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              DashboardScreen.kt
            </button>
            <button
              onClick={() => {
                sound.playChirp();
                setActiveCodeTab('mainActivity');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeCodeTab === 'mainActivity'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              MainActivity.kt
            </button>
            <button
              onClick={() => {
                sound.playChirp();
                setActiveCodeTab('theme');
              }}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeCodeTab === 'theme'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Color.kt
            </button>
            <button
              onClick={() => {
                sound.playChirp();
                setActiveCodeTab('manifest');
              }}
              className={`px-2 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeCodeTab === 'manifest'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Manifest
            </button>
            <button
              onClick={() => {
                sound.playChirp();
                setActiveCodeTab('gradle');
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeCodeTab === 'gradle'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Gradle
            </button>
          </div>
        </div>

        {/* Code Body */}
        <div className="p-3 bg-[#070913] text-[10px] font-mono text-cyan-200 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span className="truncate pr-2">
              {activeCodeTab === 'chatScreen'
                ? 'Screen: AIChatScreen.kt • Roman Urdu & English Chat'
                : activeCodeTab === 'dashboardScreen'
                ? 'Screen: HomeDashboardScreen.kt • Jetpack Compose UI'
                : activeCodeTab === 'mainActivity'
                ? 'ComponentActivity • NavHost (9 Dest) • Theme'
                : activeCodeTab === 'theme'
                ? 'Package: com.riyaz.ai.ui.theme • 8 Color Tokens'
                : activeCodeTab === 'manifest'
                ? 'Package: com.riyaz.ai • 6 Uses-Permissions'
                : 'Target SDK: 34 • Kotlin 17 • Gemini SDK 0.3.0'}
            </span>
            <button
              onClick={handleCopyCode}
              className="px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 transition-colors cursor-pointer shrink-0"
            >
              {copiedCode ? 'Copied!' : `Copy ${activeCodeTab === 'chatScreen' ? 'AIChat' : activeCodeTab === 'dashboardScreen' ? 'Dashboard' : activeCodeTab.toUpperCase()}`}
            </button>
          </div>
          <pre className="max-h-56 overflow-y-auto whitespace-pre p-2.5 rounded-xl bg-[#111524] border border-[#1E283D] text-slate-300 leading-relaxed font-mono">
            {activeCodeTab === 'chatScreen'
              ? chatScreenSnippet
              : activeCodeTab === 'dashboardScreen'
              ? dashboardScreenSnippet
              : activeCodeTab === 'mainActivity'
              ? mainActivitySnippet
              : activeCodeTab === 'theme'
              ? themeSnippet
              : activeCodeTab === 'manifest'
              ? manifestSnippet
              : gradleSnippet}
          </pre>
        </div>
      </div>

      {/* Jetpack Compose NavHost Destinations Directory */}
      <div className="p-4 rounded-2xl bg-[#111524] border border-[#1E283D] space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#00F0FF]" />
            <span>MainActivity NavHost Routes (9 Destinations)</span>
          </div>
          <span className="text-[10px] font-mono text-[#00F0FF] bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
            startDestination: "dashboard"
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[10px]">
          {[
            { route: 'dashboard', screen: 'HomeDashboardScreen' },
            { route: 'chat', screen: 'AIChatScreen' },
            { route: 'voice', screen: 'VoiceAssistantScreen' },
            { route: 'whatsapp', screen: 'WhatsAppAssistantScreen' },
            { route: 'social', screen: 'SocialMediaScreen' },
            { route: 'phone', screen: 'PhoneControlScreen' },
            { route: 'tasks', screen: 'TaskManagerScreen' },
            { route: 'permissions', screen: 'PermissionsScreen' },
            { route: 'settings', screen: 'SettingsScreen' },
          ].map((item) => (
            <button
              key={item.route}
              onClick={() => {
                sound.playChirp();
                if (onNavigateRoute) onNavigateRoute(item.route);
              }}
              className="p-2 rounded-xl bg-[#070913] border border-[#1E283D] hover:border-[#00F0FF]/50 text-left transition-colors cursor-pointer group"
            >
              <div className="font-mono font-bold text-[#00F0FF] group-hover:text-white truncate">
                "{item.route}"
              </div>
              <div className="text-[9px] text-[#8E9BAE] truncate mt-0.5">
                {item.screen}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visual Jetpack Compose Theme Swatches */}
      <div className="p-4 rounded-2xl bg-[#111524] border border-[#1E283D] space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F0FF]" />
            <span>Jetpack Compose Theme Palette (com.riyaz.ai)</span>
          </div>
          <span className="text-[10px] font-mono text-[#8E9BAE]">8 Tokens Active</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {themeTokens.map((token) => (
            <button
              key={token.name}
              onClick={() => handleCopyHex(token.hex)}
              className="p-2.5 rounded-xl bg-[#070913] border border-[#1E283D] hover:border-[#00F0FF]/50 transition-all flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-lg border border-white/20 shrink-0 shadow-sm flex items-center justify-center"
                style={{ backgroundColor: token.hex }}
              >
                {copiedHex === token.hex && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 filter drop-shadow" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] font-bold text-white group-hover:text-[#00F0FF] transition-colors truncate">
                  {token.name}
                </div>
                <div className="text-[9px] font-mono text-[#8E9BAE] flex items-center gap-1">
                  <span>{token.hex}</span>
                  {copiedHex === token.hex && <span className="text-emerald-400 font-bold">Copied!</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Android Permissions Declared in Manifest */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Declared Manifest Permissions (6 of 6 Active)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
            All Granted
          </span>
        </div>

        <div className="space-y-2 text-[11px]">
          {declaredPermissions.map((perm) => (
            <div
              key={perm.id}
              className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-3 hover:border-cyan-500/30 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-300 font-semibold text-[10px]">
                    {perm.label}
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {perm.purpose}
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="text-[10px] font-semibold">Granted</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Membership Perks */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-slate-900 border border-amber-500/30 text-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <Crown className="w-4 h-4 fill-amber-400" />
          <span>Riyaz AI Pro Features Unlocked</span>
        </div>
        <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
          <li>Unlimited Gemini 3.8 Flash text generations</li>
          <li>Zero latency smart replies for WhatsApp & Facebook</li>
          <li>High-precision Roman Urdu and Urdu translation models</li>
          <li>Automated WorkManager multi-app task scheduler</li>
        </ul>
      </div>
    </div>
  );
};
