package com.conquer_app;


import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

public class StarterService extends Service {
    private static final String TAG = "MyService";
    private PowerManager.WakeLock wakeLock;

    /**
     * starts the AlarmManager.
     */
    public NotificationCompat.Builder createNotification(String title, String content, String channel_id, int priority) {

        NotificationCompat.Builder builder = new NotificationCompat.Builder(getApplicationContext(), channel_id)
                .setSmallIcon(R.drawable.notification_icon)
                .setContentTitle(title)
                .setContentText(content)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        return builder;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        startForeground(1, createNotification("Foreground Service", "Fuck this foreground service", "foreground_services", NotificationCompat.PRIORITY_DEFAULT).build());
        //TODO: Start ongoing notification here to make service foreground

        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK,
                "MyApp::MyWakelockTag");
        wakeLock.acquire();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(this);
        //TODO: Put your AlarmManager code here
        Bundle extras = intent.getExtras();
        String taskName = extras.getString("taskName");
        Long reminderTime = extras.getLong("reminderTime");

        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this,
                0, notificationIntent, 0);


        AlarmManager alarmManager = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        alarmManager.setExact(AlarmManager.RTC, reminderTime, "reminders", new AlarmManager.OnAlarmListener() {
            @Override
            public void onAlarm() {
                notificationManager.notify(0, createNotification(taskName, "this task is incomplete", "task_reminders", 4).build());

                stopForeground(true);
                stopSelf();
            }
        }, null);

        return START_NOT_STICKY;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        wakeLock.release();
        Log.d(TAG, "onDestroy");
    }
}
