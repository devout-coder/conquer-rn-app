package com.conquer_app;

import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.util.Date;
import java.util.Map;
import java.util.HashMap;

public class TaskReminder extends ReactContextBaseJavaModule {
    TaskReminder(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "TaskReminder";
    }

    @ReactMethod
    public void saveReminder(String taskName, String reminderDate) {

        NotificationCompat.Builder builder = new NotificationCompat.Builder(getReactApplicationContext(), "task_reminders")
                .setSmallIcon(R.drawable.notification_icon)
                .setContentTitle(taskName)
                .setContentText("task is incomplete!")
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getReactApplicationContext());

// notificationId is a unique int for each notification that you must define
        notificationManager.notify(0, builder.build());
    }
}
