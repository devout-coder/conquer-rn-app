package com.conquer_app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.media.AudioAttributes;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.ReactActivity;

import android.os.Bundle;
import android.os.PowerManager;
import android.provider.Settings;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript. This is
     * used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Conquer";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);
        createNotificationChannel("task_reminders", "Task Reminders",
                "This channel handles all notifications regarding task reminders", NotificationManager.IMPORTANCE_MAX);
        createNotificationChannel("task_reminders_asheers_voice", "Task Reminders Ashneer's Voice",
                "This channel handles all notifications regarding task reminders, with notification tone of Ashneer Grover",
                NotificationManager.IMPORTANCE_MAX);
        Log.d("obscure_tag", "application has started!");

    }

    public String getApplicationName(PackageManager pm, String packageName) {
        ApplicationInfo ai;
        try {
            ai = pm.getApplicationInfo(packageName, 0);
        } catch (final PackageManager.NameNotFoundException e) {
            ai = null;
        }
        final String appName = (String) (ai != null ? pm.getApplicationLabel(ai) : "(unknown)");
        return appName;
    }

    private List<HashMap<String, String>> getInstalledApps() {
        List<HashMap<String, String>> allInstalledApps = new ArrayList<>();
        PackageManager pm = getPackageManager();
        List<ApplicationInfo> apps = pm.getInstalledApplications(PackageManager.GET_META_DATA);

        for (ApplicationInfo app : apps) {
            if (pm.getLaunchIntentForPackage(app.packageName) != null) {
                HashMap<String, String> appHash = new HashMap<>();
                appHash.put("packageName", app.packageName);
                appHash.put("appName", getApplicationName(pm, app.packageName));
                allInstalledApps.add(appHash);
            }

        }
        return allInstalledApps;
    }


    private void createNotificationChannel(String channel_id, String channel_name, String channel_description, int channel_importance) {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            Uri sound = Uri.parse(ContentResolver.SCHEME_ANDROID_RESOURCE + "://" + getApplicationContext().getPackageName() + "/" + R.raw.ashneer_angry);
            AudioAttributes attributes = new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_NOTIFICATION)
                    .build();
            NotificationChannel channel = new NotificationChannel(channel_id, channel_name, channel_importance);
            channel.setDescription(channel_description);
            if (channel_id.equals("task_reminders_asheers_voice")) {
                channel.setSound(sound, attributes);
            }
            // Register the channel with the system; you can't change the importance
            // or other notification behaviors after this
            NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    protected ReactActivityDelegate createReactActivityDelegate() {
        return new ReactActivityDelegate(this, getMainComponentName()) {
            @Override
            protected ReactRootView createRootView() {
                return new RNGestureHandlerEnabledRootView(MainActivity.this);
            }
        };
    }

}
