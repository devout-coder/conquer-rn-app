package com.conquer_app;

import static android.content.Context.ALARM_SERVICE;

import android.content.Context;
import android.os.Build;
import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.util.Log;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;

import android.app.AlarmManager;
import android.widget.Toast;

public class TaskReminder extends ReactContextBaseJavaModule {
    TaskReminder(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "TaskReminder";
    }

    public NotificationCompat.Builder createNotification(String title, String content) {

        NotificationCompat.Builder builder = new NotificationCompat.Builder(getReactApplicationContext(), "task_reminders")
                .setSmallIcon(R.drawable.notification_icon)
                .setContentTitle(title)
                .setContentText(content)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);
        return builder;
    }

    @ReactMethod
    public void saveReminder(String taskName, String reminderDate) {

        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getReactApplicationContext());
//        TODO: find out why the below commented code isn't working
        String[] parts = reminderDate.split(" GMT");
        reminderDate = parts[0];
        SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM dd yyyy HH:mm:ss");
//        notificationManager.notify(0, createNotification(taskName, reminderDate).build());
        Date date;
        try {
            date = sdf.parse(reminderDate);
        } catch (java.text.ParseException e) {
            date = new Date();
//            notificationManager.notify(0, createNotification("no this shouldn't be activated", e.toString()).build());
        }
        long millis = date.getTime();
        AlarmManager alarmManager = (AlarmManager) getReactApplicationContext().getSystemService(Context.ALARM_SERVICE);
        alarmManager.setExact(AlarmManager.RTC, millis, "reminders", new AlarmManager.OnAlarmListener() {
            @Override
            public void onAlarm() {
                notificationManager.notify(0, createNotification(taskName, "this task is incomplete").build());
            }
        }, null);
    }
}
