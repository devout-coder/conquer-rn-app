package com.conquer_app;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.provider.Settings;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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

    @ReactMethod
    public void getInstalledApps(Callback callBack) {
        List<HashMap<String, String>> allInstalledApps = new ArrayList<>();
        PackageManager pm = getReactApplicationContext().getPackageManager();
        List<ApplicationInfo> apps = pm.getInstalledApplications(PackageManager.GET_META_DATA);

        for (ApplicationInfo app : apps) {
            if (pm.getLaunchIntentForPackage(app.packageName) != null) {
                HashMap<String, String> appHash = new HashMap<>();
                appHash.put("packageName", app.packageName);
                appHash.put("appName", getApplicationName(pm, app.packageName));
                allInstalledApps.add(appHash);
            }

        }
        callBack.invoke(allInstalledApps);
    }
}
