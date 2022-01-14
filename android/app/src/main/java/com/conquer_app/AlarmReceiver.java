package com.conquer_app;

import android.app.AlarmManager;
import android.app.Application;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.os.IBinder;
import android.util.Log;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

public class AlarmReceiver extends BroadcastReceiver {

    public NotificationCompat.Builder createNotification(Context context, String title, String content, String channel_id, int priority) {

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channel_id)
                .setSmallIcon(R.drawable.notification_icon)
                .setContentTitle(title)
                .setContentText(content)
                .setPriority(priority);
        return builder;
    }

    @Override
    public void onReceive(Context context, Intent arg1) {
        Log.d("obscure_tag", "broadcast is getting received, alarm triggered");
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
        notificationManager.notify(0, createNotification(context, "Shit task", "this task is incomplete", "task_reminders", 4).build());
    }
}
