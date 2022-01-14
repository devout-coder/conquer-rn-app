package com.conquer_app;


import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.os.SystemClock;
import android.util.Log;
import android.view.KeyEvent;
import android.view.accessibility.AccessibilityEvent;
import android.widget.Toast;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import java.util.Date;
import java.util.concurrent.TimeUnit;

public class ApplicationListenerService extends AccessibilityService {

    public NotificationCompat.Builder createNotification(String title, String content, String channel_id, int priority) {

        NotificationCompat.Builder builder = new NotificationCompat.Builder(this, channel_id)
                .setSmallIcon(R.drawable.notification_icon)
                .setContentTitle(title)
                .setContentText(content)
                .setPriority(priority);
        return builder;
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent accessibilityEvent) {

        String packageName = accessibilityEvent.getPackageName().toString();

        //TODO: test this shit

        if (!packageName.equals("com.android.systemui")) {
            SharedPreferences sharedPref = this.getSharedPreferences(
                    "ApplicationListener", Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();

            String storedPackage = sharedPref.getString("current_running_application", "none");
//            Log.d("obscure_tag", storedPackage);
            if (storedPackage.equals("none")) {
                if (packageName.equals("com.brave.browser")) {
                    //instead of chrome check for all blacklisted apps
                    Log.d("obscure_tag", "brave has been detected for the first time...starting alarm");
                    editor.putString("current_running_application", packageName);
                    editor.apply();

                    AlarmManager alarmMgr = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
                    Intent intent = new Intent(this, AlarmReceiver.class);
                    PendingIntent alarmIntent = PendingIntent.getBroadcast(this, 1, intent, 0);
                    long timeMilli = new Date().getTime();
                    alarmMgr.setRepeating(AlarmManager.RTC,
                            timeMilli, 60000 * 10,
                            alarmIntent);

                }
            } else if (storedPackage.equals(packageName)) {
//                Log.d("obscure_tag", "chrome has been detected for the second time..doing nothing");
            } else {
                //delete alarm and stored package
                Log.d("obscure_tag", "different app is detected...alarm getting cancelled...");
                editor.clear();
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
