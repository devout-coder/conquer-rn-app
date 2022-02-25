package com.conquer_app;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;

import android.content.Intent;
import android.util.Log;

import com.facebook.react.ReactActivity;

public class NewFriendActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(null);

        Intent intent = getIntent();
        String action = intent.getAction();
        Uri data = intent.getData();
        Log.d("obscure_tag", data.toString());
    }
}
