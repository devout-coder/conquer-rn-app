package com.conquer_app;


import android.accessibilityservice.AccessibilityService;
import android.accessibilityservice.AccessibilityServiceInfo;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.util.Log;
import android.view.KeyEvent;
import android.view.accessibility.AccessibilityEvent;
import android.widget.Toast;

public class MyService extends AccessibilityService {
    @Override
    public void onAccessibilityEvent(AccessibilityEvent accessibilityEvent) {
        String packageName = accessibilityEvent.getPackageName().toString();
        PackageManager packageManager = this.getPackageManager();
        try {
            ApplicationInfo applicationInfo = packageManager.getApplicationInfo(packageName, 0);
            CharSequence applicationLabel = packageManager.getApplicationLabel(applicationInfo);
            Log.d("obscure_tag", "current running application is: " + applicationLabel);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onInterrupt() {
        Log.d("obscure_tag", "service is interrupted");
    }

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();

        AccessibilityServiceInfo info = new AccessibilityServiceInfo();
        // Set the type of events that this service wants to listen to. Others
        // won't be passed to this service.
        info.eventTypes =AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED;


        // If you only want this service to work with specific applications, set their
        // package names here. Otherwise, when the service is activated, it will listen
        // to events from all applications.

        // Set the type of feedback your service will provide.
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_SPOKEN;

        // Default services are invoked only if no package-specific ones are present
        // for the type of AccessibilityEvent generated. This service *is*
        // application-specific, so the flag isn't necessary. If this was a
        // general-purpose service, it would be worth considering setting the
        // DEFAULT flag.

        // info.flags = AccessibilityServiceInfo.DEFAULT;

        info.notificationTimeout = 100;

        this.setServiceInfo(info);
        Log.d("obscure_tag", "service is connected");
    }
    //    @Override
//    protected boolean onKeyEvent(KeyEvent event) {
//
//        int action = event.getAction();
//        int keyCode = event.getKeyCode();
//        // the service listens for both pressing and releasing the key
//        // so the below code executes twice, i.e. you would encounter two Toasts
//        // in order to avoid this, we wrap the code inside an if statement
//        // which executes only when the key is released
//        if (action == KeyEvent.ACTION_UP) {
//            if (keyCode == KeyEvent.KEYCODE_VOLUME_UP) {
//                Log.d("Check", "KeyUp");
//                Toast.makeText(this, "KeyUp", Toast.LENGTH_SHORT).show();
//            } else if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
//                Log.d("Check", "KeyDown");
//                Toast.makeText(this, "KeyDown", Toast.LENGTH_SHORT).show();
//            }
//        }
//        return super.onKeyEvent(event);
//    }
}
