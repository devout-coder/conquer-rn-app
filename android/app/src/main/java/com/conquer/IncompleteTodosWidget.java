package com.conquer;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.widget.RemoteViews;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Implementation of App Widget functionality.
 */
public class IncompleteTodosWidget extends AppWidgetProvider {

    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager,
                                int appWidgetId) {


        Intent intent = new Intent(context, timeTypeSelector.class);
        intent.setAction("timeType_selector_clicked");
        PendingIntent pendingIntent = PendingIntent.getActivity(
                /* context = */ context,
                /* requestCode = */ 0,
                /* intent = */ intent,
                /* flags = */ PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.incomplete_todos_widget);

        views.setOnClickPendingIntent(R.id.timeType_selector, pendingIntent);


        appWidgetManager.updateAppWidget(appWidgetId, views);
    }

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // There may be multiple widgets active, so update all of them
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        Log.d("debug_tag", intent.getAction().toString());
        if("timeType_selector_clicked".equals(intent.getAction())){
            Log.d("debug_tag", "intent received");
            final WritableMap params = Arguments.createMap();
            params.putString("val", "demo");
            ReactContext reactContext = (ReactContext) context;
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("timeType_expanded", params);

        }
    }
}