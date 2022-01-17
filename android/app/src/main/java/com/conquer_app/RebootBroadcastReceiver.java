package com.conquer_app;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public class RebootBroadcastReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent arg1) {
        Log.d("Autostart", "boot has completed. Starting application listener");

        if (arg1.getAction().equals("android.intent.action.BOOT_COMPLETED")) {
            Intent intent = new Intent(context, ApplicationListenerService.class);
            context.startService(intent);
        }
    }
}
