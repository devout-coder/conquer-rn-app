package com.conquer_app;

import android.util.Log;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import android.util.Log;

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
    public void saveReminder(String reminderDate) {
        Log.d("Tag", reminderDate);
    }
}
