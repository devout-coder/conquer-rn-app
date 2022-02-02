package com.conquer_app;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.provider.Settings;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.io.ByteArrayOutputStream;
import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class InstalledApplicationsFetcher extends ReactContextBaseJavaModule {

    InstalledApplicationsFetcher(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "InstalledApplicationsFetcher";
    }

    private String getApplicationName(PackageManager pm, String packageName) {
        ApplicationInfo ai;
        try {
            ai = pm.getApplicationInfo(packageName, 0);
        } catch (final PackageManager.NameNotFoundException e) {
            ai = null;
        }
        final String appName = (String) (ai != null ? pm.getApplicationLabel(ai) : "(unknown)");
        return appName;
    }

    public static Bitmap drawableToBitmap(Drawable drawable) {
        Bitmap bitmap = null;

        if (drawable instanceof BitmapDrawable) {
            BitmapDrawable bitmapDrawable = (BitmapDrawable) drawable;
            if (bitmapDrawable.getBitmap() != null) {
                return bitmapDrawable.getBitmap();
            }
        }

        if (drawable.getIntrinsicWidth() == 0 || drawable.getIntrinsicHeight() == 0) {
            bitmap = Bitmap.createBitmap(1, 1, Bitmap.Config.ARGB_8888); // Single color bitmap will be created of 1x1
            // pixel
        } else {
            bitmap = Bitmap.createBitmap(drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight(),
                    Bitmap.Config.ARGB_8888);
        }

        Canvas canvas = new Canvas(bitmap);
        drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
        drawable.draw(canvas);
        return bitmap;
    }

    public static String convertBitmapToString(Bitmap bitmap) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.PNG, 100, outputStream);

        return Base64.encodeToString(outputStream.toByteArray(), Base64.DEFAULT);
    }

    public static String convertDrawableToString(Drawable drawable) {
        try {
            return convertBitmapToString(drawableToBitmap(drawable));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    @ReactMethod
    public void getInstalledApps(Callback callBack) {
        final WritableArray allInstalledApps = Arguments.createArray();
        PackageManager pm = getReactApplicationContext().getPackageManager();
        List<ApplicationInfo> apps = pm.getInstalledApplications(PackageManager.GET_META_DATA);

        for (ApplicationInfo app : apps) {
            if (pm.getLaunchIntentForPackage(app.packageName) != null) {
                final WritableMap appInfo = Arguments.createMap();
                appInfo.putString("appPackageName", app.packageName);
                appInfo.putString("appName", getApplicationName(pm, app.packageName));
                // appInfo.putString("appIcon", );
                Drawable appIcon;
                try {
                    appIcon = pm.getApplicationIcon(app.packageName);
                    appInfo.putString("appIcon", convertDrawableToString(appIcon));
                } catch (PackageManager.NameNotFoundException e) {
                    return;
                }
                allInstalledApps.pushMap(appInfo);
            }

        }
        callBack.invoke(allInstalledApps);
    }

    @ReactMethod
    public void getNudgerSwitchState(Callback callback) {
        SharedPreferences sharedPref = getReactApplicationContext().getSharedPreferences(
                "ApplicationListener", Context.MODE_PRIVATE);

        String isNudgerOn = sharedPref.getString("isNudgerOn", "none");
        callback.invoke(isNudgerOn);
    }

    @ReactMethod
    public void saveNudgerSwitchState(boolean newSwitchState) {

        String nudgerOn = newSwitchState ? "true" : "false";

        SharedPreferences sharedPref = getReactApplicationContext().getSharedPreferences(
                "ApplicationListener", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();

        editor.putString("isNudgerOn", nudgerOn);
        editor.apply();

    }

    @ReactMethod
    public void getNudgerDetails(Callback callback) {

        SharedPreferences sharedPref = getReactApplicationContext().getSharedPreferences(
                "ApplicationListener", Context.MODE_PRIVATE);

        String blacklistedApps = sharedPref.getString("blacklistedApps", "none");
        String blacklistedWebsites = sharedPref.getString("blacklistedWebsites", "none");
        String timeDuration = sharedPref.getString("timeDuration", "none");
        String timeTypeDropdownValue = sharedPref.getString("timeTypeDropdownValue", "none");
        String timeType = sharedPref.getString("timeType", "none");

        final WritableMap nudgerDetails = Arguments.createMap();
        nudgerDetails.putString("blacklistedApps", blacklistedApps);
        nudgerDetails.putString("blacklistedWebsites", blacklistedWebsites);
        nudgerDetails.putString("timeDuration", timeDuration);
        nudgerDetails.putString("timeTypeDropdownValue", timeTypeDropdownValue);
        nudgerDetails.putString("timeType", timeType);
        callback.invoke(nudgerDetails);

    }

    @ReactMethod
    public void saveNudgerDetails(String blacklistedApps, String blacklistedWebsites,
            String timeDuration, String timeTypeDropdownValue, String timeType) {

        // String nudgerOn = isNudgerOn ? "true" : "false";

        SharedPreferences sharedPref = getReactApplicationContext().getSharedPreferences(
                "ApplicationListener", Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPref.edit();

        editor.putString("blacklistedApps", blacklistedApps);
        editor.putString("blacklistedWebsites", blacklistedWebsites);
        editor.putString("timeDuration", timeDuration);
        editor.putString("timeTypeDropdownValue", timeTypeDropdownValue);
        editor.putString("timeType", timeType);
        editor.apply();

    }
}
