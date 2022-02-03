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

import java.util.ArrayList;
import java.util.Date;

public class AlarmReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent arg1) {
        Log.d("obscure_tag", "broadcast is getting received, alarm triggered");

        SharedPreferences sharedPref = context.getSharedPreferences(
                "ApplicationListener", Context.MODE_PRIVATE);
        String storedPackage = sharedPref.getString("current_running_application", "none");

        if (!isDeviceLocked(context) && !storedPackage.equals("none")) {

            String user = FirebaseAuth.getInstance().getCurrentUser().getUid();
            FirebaseFirestore db = FirebaseFirestore.getInstance();
            Query query = db.collection("todos").whereEqualTo("user", user).whereEqualTo("time", "4/2/2022").orderBy("priority", Query.Direction.DESCENDING);
            query.get().
                    addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                        @Override
                        public void onComplete(@NonNull Task<QuerySnapshot> task) {
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
                        }
                    });

            String timeDuration = sharedPref.getString("timeDuration", "15");
            String timeTypeDropdownValue = sharedPref.getString("timeTypeDropdownValue", "minutes");
            AlarmManager alarmMgr = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            Intent intent = new Intent(context, AlarmReceiver.class);
            PendingIntent alarmIntent = PendingIntent.getBroadcast(context, 1, intent, 0);
            long timeMilli = new Date().getTime();
//            alarmMgr.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,
//                    timeMilli + stringToTimeDuration(timeDuration, timeTypeDropdownValue),
//                    alarmIntent);
            AlarmManager.AlarmClockInfo alarmClockInfo = new AlarmManager.AlarmClockInfo(timeMilli + stringToTimeDuration(timeDuration, timeTypeDropdownValue), alarmIntent);
            alarmMgr.setAlarmClock(alarmClockInfo, alarmIntent);
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

}
