package com.conquer_app;


import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import android.view.accessibility.AccessibilityEvent;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;


public class ApplicationListenerService extends AccessibilityService {

    ArrayList<String> blacklistedPackages = new ArrayList<String>(Arrays.asList("com.mojang.minecraftpe", "com.twitter.android", "com.flippfly.racethesun", "com.yodo1.crossyroad", "com.reddit.frontpage", "com.whatsapp", "org.telegram.messenger", "com.google.android.youtube"));

    @Override
    public void onAccessibilityEvent(AccessibilityEvent accessibilityEvent) {

        String currentPackage = accessibilityEvent.getPackageName().toString();

        //TODO: test this shit

        if (!currentPackage.equals("com.android.systemui")) {
            SharedPreferences sharedPref = this.getSharedPreferences(
                    "ApplicationListener", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();

            String storedPackage = sharedPref.getString("current_running_application", "none");

            if (storedPackage.equals("none")) {
                if (blacklistedPackages.contains(currentPackage)) {

                    Log.d("obscure_tag", "blacklisted app has been detected for the first time...starting alarm");
                    editor.putString("current_running_application", currentPackage);
                    editor.apply();

                    AlarmManager alarmMgr = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
                    Intent intent = new Intent(this, AlarmReceiver.class);
                    PendingIntent alarmIntent = PendingIntent.getBroadcast(this, 1, intent, 0);
                    long timeMilli = new Date().getTime();
                    alarmMgr.setRepeating(AlarmManager.RTC,
                            timeMilli, 60000 * 10,
                            alarmIntent);

                }
            } else if (storedPackage.equals(currentPackage)) {
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

        this.setServiceInfo(info);
    }
}
