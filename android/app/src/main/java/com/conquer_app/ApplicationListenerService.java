package com.conquer_app;


import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.PowerManager;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import androidx.annotation.NonNull;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;


public class ApplicationListenerService extends AccessibilityService {

    ArrayList<String> blacklistedPackages = new ArrayList<String>(Arrays.asList("com.mojang.minecraftpe", "com.twitter.android", "com.flippfly.racethesun", "com.yodo1.crossyroad", "com.reddit.frontpage", "com.whatsapp", "org.telegram.messenger", "com.google.android.youtube"));

    ArrayList<String> blacklistedWebsites = new ArrayList<String>(Arrays.asList("youtube.com", "instagram.com", "reddit.com", "twitter.com", "quora.com"));

    private HashMap<String, Long> previousUrlDetections = new HashMap<>();

    @Override
    public void onAccessibilityEvent(AccessibilityEvent accessibilityEvent) {

        String currentPackage = accessibilityEvent.getPackageName().toString();


        if (!currentPackage.equals("com.android.systemui")) {

            if (isBrowserRunning(currentPackage)) {

                AccessibilityNodeInfo parentNodeInfo = accessibilityEvent.getSource();
                if (parentNodeInfo == null) {
                    return;
                }
                ApplicationListenerService.SupportedBrowserConfig browserConfig = null;
                for (ApplicationListenerService.SupportedBrowserConfig supportedConfig : getSupportedBrowsers()) {
                    if (supportedConfig.packageName.equals(currentPackage)) {
                        browserConfig = supportedConfig;
                    }
                }
                String capturedUrl = captureUrl(parentNodeInfo, browserConfig);
                parentNodeInfo.recycle();

                //we can't find a url. Browser either was updated or opened page without url text field
                if (capturedUrl == null) {
                    return;
                }

                long eventTime = accessibilityEvent.getEventTime();
                String detectionId = currentPackage + ", and url " + capturedUrl;
                //noinspection ConstantConditions
                long lastRecordedTime = previousUrlDetections.containsKey(detectionId) ? previousUrlDetections.get(detectionId) : 0;
                //some kind of redirect throttling
                if (eventTime - lastRecordedTime > 2000) {
                    previousUrlDetections.put(detectionId, eventTime);
                    currentPackage = capturedUrl;
                }
            }

            SharedPreferences sharedPref = this.getSharedPreferences(
                    "ApplicationListener", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();
//            Log.d("obscure_tag", currentPackage);
            String storedPackage = sharedPref.getString("current_running_application", "none");
            if (!packageNames().contains(currentPackage)) {
                if (storedPackage.equals("none")) {
                    if (blacklistedPackages.contains(currentPackage) || blackListedWebsiteContainsPackage(currentPackage)) {

                        Log.d("obscure_tag", "blacklisted app has been detected for the first time...starting alarm");
                        editor.putString("current_running_application", currentPackage);
                        editor.apply();

                        AlarmManager alarmMgr = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
                        Intent intent = new Intent(this, AlarmReceiver.class);
                        PendingIntent alarmIntent = PendingIntent.getBroadcast(this, 1, intent, 0);
                        long timeMilli = new Date().getTime();
                        alarmMgr.setRepeating(AlarmManager.RTC_WAKEUP,
                                timeMilli, 60000 * 10,
                                alarmIntent);

                    }
                } else if (currentPackage.contains(storedPackage)) {
//                Log.d("obscure_tag", "blacklisted app has been detected for the second time..doing nothing");
                } else {
                    //delete alarm and stored package
                    Log.d("obscure_tag", "different app is detected...alarm getting cancelled...");
                    editor.remove("current_running_application");
                    editor.apply();
                    AlarmManager alarmMgr = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
                    Intent intent = new Intent(this, AlarmReceiver.class);
                    PendingIntent alarmIntent = PendingIntent.getBroadcast(this, 1, intent, 0);
                    alarmMgr.cancel(alarmIntent);
                }
            }
        }
    }

    private boolean isBrowserRunning(String currentPackage) {
        if (packageNames().contains(currentPackage)) {
            return true;
        } else {
            return false;
        }
    }

    private boolean blackListedWebsiteContainsPackage(String currentPackage) {
        boolean blackListedWebsiteContainsPackage = false;
        for (String blacklistedWebsite :
                blacklistedWebsites) {
            if (currentPackage.contains(blacklistedWebsite)) {
                blackListedWebsiteContainsPackage = true;
            }
        }
        return blackListedWebsiteContainsPackage;
    }

    private String captureUrl(AccessibilityNodeInfo info, ApplicationListenerService.SupportedBrowserConfig config) {
        List<AccessibilityNodeInfo> nodes = info.findAccessibilityNodeInfosByViewId(config.addressBarId);
        if (nodes == null || nodes.size() <= 0) {
            return null;
        }

        AccessibilityNodeInfo addressBarNodeInfo = nodes.get(0);
        String url = null;
        if (addressBarNodeInfo.getText() != null) {
            url = addressBarNodeInfo.getText().toString();
        }
        addressBarNodeInfo.recycle();
        url = url.split("/")[0];
        return url;
    }


    @NonNull
    private static ArrayList<String> packageNames() {
        ArrayList<String> packageNames = new ArrayList<>();
        for (ApplicationListenerService.SupportedBrowserConfig config : getSupportedBrowsers()) {
            packageNames.add(config.packageName);
        }
        return packageNames;
    }

    private static class SupportedBrowserConfig {
        public String packageName, addressBarId;

        public SupportedBrowserConfig(String packageName, String addressBarId) {
            this.packageName = packageName;
            this.addressBarId = addressBarId;
        }
    }

    /**
     * @return a list of supported browser configs
     * This list could be instead obtained from remote server to support future browser updates without updating an app
     */
    @NonNull
    private static List<ApplicationListenerService.SupportedBrowserConfig> getSupportedBrowsers() {
        List<ApplicationListenerService.SupportedBrowserConfig> browsers = new ArrayList<>();
        browsers.add(new ApplicationListenerService.SupportedBrowserConfig("com.android.chrome", "com.android.chrome:id/url_bar"));
        browsers.add(new ApplicationListenerService.SupportedBrowserConfig("org.mozilla.firefox", "org.mozilla.firefox:id/url_bar_title"));
        browsers.add(new ApplicationListenerService.SupportedBrowserConfig("com.brave.browser", "com.brave.browser:id/url_bar"));
        return browsers;
    }

    @Override
    public void onInterrupt() {
        Log.d("obscure_tag", "service is interrupted");
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();

        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        info.eventTypes = AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED;
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_SPOKEN;

        info.notificationTimeout = 100;

//        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
//        PowerManager.WakeLock wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
//                "MyApp::MyWakelockTag");
//        wakeLock.acquire();

        this.setServiceInfo(info);
    }
}
