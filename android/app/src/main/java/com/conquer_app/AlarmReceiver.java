package com.conquer_app;
//this is not being used currently

import android.app.AlarmManager;
import android.app.Application;
import android.app.KeyguardManager;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.icu.util.Calendar;
import android.os.Bundle;
import android.os.IBinder;
import android.provider.Settings;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.Query;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;

import static java.time.DayOfWeek.MONDAY;
import static java.time.DayOfWeek.SUNDAY;
import static java.time.temporal.TemporalAdjusters.nextOrSame;
import static java.time.temporal.TemporalAdjusters.previousOrSame;


public class AlarmReceiver extends BroadcastReceiver {

    String[] weekMonths = {"Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"};

    @Override
    public void onReceive(Context context, Intent arg1) {
        Log.d("obscure_tag", "broadcast is getting received, alarm triggered");

        SharedPreferences sharedPref = context.getSharedPreferences(
                "ApplicationListener", Context.MODE_PRIVATE);
        String storedPackage = sharedPref.getString("current_running_application", "none");
        String timeType = sharedPref.getString("timeType", "none");

        if (!isDeviceLocked(context) && !storedPackage.equals("none")) {
            String user = FirebaseAuth.getInstance().getCurrentUser().getUid();
            FirebaseFirestore db = FirebaseFirestore.getInstance();
            Query query = db.collection("todos").whereEqualTo("user", user).whereEqualTo("time", timeType.equals("yearly") ? Integer.parseInt(getCurrentTime(timeType)) : getCurrentTime(timeType)).whereEqualTo("finished", false).orderBy("priority", Query.Direction.DESCENDING);
            query.get().
                    addOnCompleteListener(task -> {
                        if (task.isSuccessful()) {
                            String allTasks = "";
                            for (QueryDocumentSnapshot document : task.getResult()) {
                                allTasks = allTasks + "• " + document.getData().get("taskName") + "\n";
                            }
                            if (!allTasks.equals("")) {
                                NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
                                notificationManager.notify(0,
                                        createNotification(context, "You have stuff to do!", allTasks, "task_reminders", NotificationCompat.PRIORITY_HIGH).build());
                            }
                        } else {
                            Log.d("obscure_tag", "Error getting documents.", task.getException());
                        }
                    });

//            NotificationManagerCompat notificationManager = NotificationManagerCompat.from(context);
//            notificationManager.notify(0,
//                    createNotification(context, "You have stuff to do!", getCurrentTime(timeType), "task_reminders", NotificationCompat.PRIORITY_HIGH).build());


            String timeDuration = sharedPref.getString("timeDuration", "15");
            String timeTypeDropdownValue = sharedPref.getString("timeTypeDropdownValue", "minutes");
            AlarmManager alarmMgr = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            Intent intent = new Intent(context, AlarmReceiver.class);
            PendingIntent alarmIntent = PendingIntent.getBroadcast(context, 1, intent, 0);
            long timeMilli = new Date().getTime();
            AlarmManager.AlarmClockInfo alarmClockInfo = new AlarmManager.AlarmClockInfo(timeMilli + stringToTimeDuration(timeDuration, timeTypeDropdownValue), alarmIntent);
            alarmMgr.setAlarmClock(alarmClockInfo, alarmIntent);
        }
    }

    private String stripZero(String dayOrWeek) {
        if (String.valueOf(dayOrWeek.charAt(0)).equals("0")) {
            return String.valueOf(dayOrWeek.charAt(1));
        } else {
            return dayOrWeek;
        }
    }

    private String formatWeek(String unformattedWeek) {
        String[] unformattedWeekArray = unformattedWeek.split("-");
        String year = unformattedWeekArray[0];
        String week = stripZero(unformattedWeekArray[1]);
        String day = stripZero(unformattedWeekArray[2]);
        String requiredFormat = day + " " + weekMonths[Integer.parseInt(week) - 1] + " " + year;
        return requiredFormat;
    }

    private String getCurrentTime(String timeType) {
        LocalDateTime time = LocalDateTime.now();

        if (timeType.equals("daily")) {
            int day = time.getDayOfMonth();
            int month = time.getMonthValue();
            int year = time.getYear();
            String requiredDate = Integer.toString(day) + "/" + Integer.toString(month) + "/" + Integer.toString(year);
            return requiredDate;
        } else if (timeType.equals("weekly")) {
            LocalDate today = LocalDate.now();

            LocalDate monday = today.with(previousOrSame(MONDAY));
            LocalDate sunday = today.with(nextOrSame(SUNDAY));
            String firstDayString = formatWeek(monday.toString());
            String lastDayString = formatWeek(sunday.toString());
            return firstDayString + "-" + lastDayString;
            //this is in the format yyyy-mm-dd
            //i want it in 31 Jan 2022-6 Feb 2022
        } else if (timeType.equals("monthly")) {
            String month = time.getMonth().toString();
            month = convertToTitleCase(month);
            String year = Integer.toString(time.getYear());
            return month + " " + year;
        } else if (timeType.equals("yearly")) {
            int year = Calendar.getInstance().get(Calendar.YEAR);
            return Integer.toString(year);
        } else {
            return "Long Term Goals🎯";
        }
    }

    public NotificationCompat.Builder createNotification(Context context, String title, String content,
                                                         String channel_id, int priority) {

        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channel_id)
                .setSmallIcon(R.drawable.notification_icon)
                .setContentTitle(title)
                .setStyle(new NotificationCompat.BigTextStyle()
                        .bigText(content))
                .setSound(Settings.System.DEFAULT_NOTIFICATION_URI)
                .setDefaults(NotificationCompat.DEFAULT_SOUND | NotificationCompat.DEFAULT_VIBRATE) //Important for heads-up notification
                .setVibrate(new long[]{1000, 1000, 1000, 1000, 1000})
                .setPriority(priority);
        return builder;
    }

    private boolean isDeviceLocked(Context context) {
        KeyguardManager myKM = (KeyguardManager) context.getSystemService(Context.KEYGUARD_SERVICE);
        if (myKM.inKeyguardRestrictedInputMode()) {
            return true;
        } else {
            return false;
        }
    }

    private int stringToTimeDuration(String timeDuration, String timeTypeDropdownValue) {
        int timeDurationInteger = Integer.parseInt(timeDuration);
        int requiredTimeDuration;
        if (timeTypeDropdownValue.equals("minutes")) {
            return timeDurationInteger * 60000;
        } else {
            return timeDurationInteger * 3600000;
        }
    }

    public static String convertToTitleCase(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }

        StringBuilder converted = new StringBuilder();

        boolean convertNext = true;
        for (char ch : text.toCharArray()) {
            if (Character.isSpaceChar(ch)) {
                convertNext = true;
            } else if (convertNext) {
                ch = Character.toTitleCase(ch);
                convertNext = false;
            } else {
                ch = Character.toLowerCase(ch);
            }
            converted.append(ch);
        }

        return converted.toString();
    }

}
