package com.conquer_app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.ReactActivity;

import android.os.Bundle;

import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView;

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
        createNotificationChannel("task_reminders", "Task Reminders", "This channel handles all notifications regarding task reminders", NotificationManager.IMPORTANCE_MAX);
        createNotificationChannel("foreground_services", "Foreground Service", "This channel handles that annoying notification which can't be turned off due to some fucking Android Policy", NotificationManager.IMPORTANCE_NONE);
    }

    private void createNotificationChannel(String channel_id, String channel_name, String channel_description, int channel_importance) {
        // Create the NotificationChannel, but only on API 26+ because
        // the NotificationChannel class is new and not in the support library
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(channel_id, channel_name, channel_importance);
            channel.setDescription(channel_description);
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
