package com.conquer_app;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class Autostart extends BroadcastReceiver {

    /**
     * Listens for Android's BOOT_COMPLETED broadcast and then executes
     * the onReceive() method.
     */
    @Override
    public void onReceive(Context context, Intent arg1) {
        Log.d("Autostart", "BOOT_COMPLETED broadcast received. Executing starter service.");

        Intent intent = new Intent(context, StarterService.class);
        context.startService(intent);
    }
}
