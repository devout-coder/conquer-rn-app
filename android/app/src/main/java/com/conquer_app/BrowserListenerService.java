package com.conquer_app;


import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import android.view.accessibility.AccessibilityNodeInfo;

import androidx.annotation.NonNull;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

public class BrowserListenerService extends AccessibilityService {

    private HashMap<String, Long> previousUrlDetections = new HashMap<>();

    ArrayList<String> blacklistedPackages = new ArrayList<String>(Arrays.asList("youtube.com", "instagram.com", "reddit.com", "twitter.com", "quora.com"));

    @Override
    public void onAccessibilityEvent(@NonNull AccessibilityEvent event) {
//        Log.d("obscure_tag", "browser listener service accessibility event happened");
        AccessibilityNodeInfo parentNodeInfo = event.getSource();
        if (parentNodeInfo == null) {
            return;
        }

        String packageName = event.getPackageName().toString();
        SupportedBrowserConfig browserConfig = null;
        for (SupportedBrowserConfig supportedConfig : getSupportedBrowsers()) {
            if (supportedConfig.packageName.equals(packageName)) {
                browserConfig = supportedConfig;
            }
        }
        //this is not supported browser, so exit
        if (browserConfig == null) {
            return;
        }

        String capturedUrl = captureUrl(parentNodeInfo, browserConfig);
        parentNodeInfo.recycle();

        //we can't find a url. Browser either was updated or opened page without url text field
        if (capturedUrl == null) {
            return;
        }

        long eventTime = event.getEventTime();
        String detectionId = packageName + ", and url " + capturedUrl;
        //noinspection ConstantConditions
        long lastRecordedTime = previousUrlDetections.containsKey(detectionId) ? previousUrlDetections.get(detectionId) : 0;
        //some kind of redirect throttling
        if (eventTime - lastRecordedTime > 2000) {
            previousUrlDetections.put(detectionId, eventTime);
            analyzeCapturedUrl(capturedUrl, browserConfig.packageName);
        }
    }

    @Override
    public void onInterrupt() {
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();

        Log.d("obscure_tag", "browser listener service connected");
        AccessibilityServiceInfo info = new AccessibilityServiceInfo();

        info.eventTypes = AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED;
        info.packageNames = packageNames();
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_VISUAL;

        info.notificationTimeout = 300;

        info.flags = AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS |
                AccessibilityServiceInfo.FLAG_RETRIEVE_INTERACTIVE_WINDOWS;

        this.setServiceInfo(info);
    }

    private String captureUrl(AccessibilityNodeInfo info, SupportedBrowserConfig config) {
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
        return url;
    }

    private void analyzeCapturedUrl(@NonNull String capturedUrl, @NonNull String browserPackage) {

        if (capturedUrl.contains("youtube.com")) {
//            performRedirect(redirectUrl, browserPackage);
            Log.d("obscure_tag", "youtube is opened!!");
        }
    }

    @NonNull
    private static String[] packageNames() {
        List<String> packageNames = new ArrayList<>();
        for (SupportedBrowserConfig config : getSupportedBrowsers()) {
            packageNames.add(config.packageName);
        }
        return packageNames.toArray(new String[0]);
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
    private static List<SupportedBrowserConfig> getSupportedBrowsers() {
        List<SupportedBrowserConfig> browsers = new ArrayList<>();
        browsers.add(new SupportedBrowserConfig("com.android.chrome", "com.android.chrome:id/url_bar"));
        browsers.add(new SupportedBrowserConfig("org.mozilla.firefox", "org.mozilla.firefox:id/url_bar_title"));
        browsers.add(new SupportedBrowserConfig("com.brave.browser", "com.brave.browser:id/url_bar"));
        return browsers;
    }
}
