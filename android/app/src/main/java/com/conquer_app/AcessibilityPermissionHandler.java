package com.conquer_app;

import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AcessibilityPermissionHandler extends ReactContextBaseJavaModule {

    AcessibilityPermissionHandler(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "AcessibilityPermissionHandler";
    }

    @ReactMethod
    public int checkAccessibilityPermission() {
        int accessEnabled = -1;
        try {
            accessEnabled = Settings.Secure.getInt(getReactApplicationContext().getContentResolver(), Settings.Secure.ACCESSIBILITY_ENABLED);
        } catch (Settings.SettingNotFoundException e) {
            Toast.makeText(getReactApplicationContext(), e.toString(), Toast.LENGTH_LONG).show();
        }
        //0 = accessibility permission not granted
        //1 = accessibility permission granted
        //-1 = some error occurred
        return accessEnabled;
    }

    @ReactMethod
    public void navigateToAccessibilitySettings() {
        Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
        getReactApplicationContext().startActivity(intent);
    }


}
