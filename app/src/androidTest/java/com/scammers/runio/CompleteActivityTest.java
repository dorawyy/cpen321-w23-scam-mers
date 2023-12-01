package com.scammers.runio;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

import android.content.Context;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.SystemClock;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.espresso.ViewInteraction;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.rule.GrantPermissionRule;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiObjectNotFoundException;
import androidx.test.uiautomator.UiSelector;
import androidx.test.uiautomator.Until;

import org.hamcrest.Description;
import org.hamcrest.Matcher;
import org.hamcrest.TypeSafeMatcher;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

import java.io.IOException;

@RunWith(AndroidJUnit4.class)
public class CompleteActivityTest {

    @Rule
    public ActivityScenarioRule<MainActivity> mActivityScenarioRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Rule
    public GrantPermissionRule mGrantPermissionRule =
            GrantPermissionRule.grant(
                    "android.permission.ACCESS_FINE_LOCATION",
                    "android.permission.ACCESS_COARSE_LOCATION");

    private UiDevice device;
    private int clickCount = 0;
    private int NR_MAX_CLICKS = 5;

    @Before
    public void setUp() throws IOException {
        device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
        String s = device.getCurrentPackageName();
        device.executeShellCommand(
                "appops set " + s + " android:mock_location allow"
        );
    }

    @Test
    public void completeActivityTest()
            throws InterruptedException, UiObjectNotFoundException {
        ViewInteraction id = onView(
                allOf(withText("Sign in"),
                      childAtPosition(
                              allOf(withId(R.id.sign_in_button),
                                    childAtPosition(
                                            withClassName(
                                                    is("androidx.constraintlayout.widget.ConstraintLayout")),
                                            1)),
                              0),
                      isDisplayed()));
        id.perform(click());
        clickCount++;

        // Wait for the account picker to appear
        device.wait(Until.hasObject(By.pkg("com.google.android.gms.auth")), 5000);

        // Find and click on the first Google account
        UiObject
                firstAccount = device.findObject(new UiSelector().resourceId("com.google.android.gms:id/account_display_name").index(0));
        firstAccount.click();

        ViewInteraction materialButton2 = onView(
                allOf(withId(R.id.start_activity_button),
                      withText("Start Activity"),
                      childAtPosition(
                              childAtPosition(
                                      withId(android.R.id.content),
                                      0),
                              0),
                      isDisplayed()));
        materialButton2.perform(click());
        clickCount++;

//        LocationManager lm = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        Context context = InstrumentationRegistry.getInstrumentation().getContext();
        LocationManager lm = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        Criteria criteria = new Criteria();
        criteria.setAccuracy( Criteria.ACCURACY_FINE );

        String mocLocationProvider = LocationManager.GPS_PROVIDER;//lm.getBestProvider( criteria, true );

        lm.addTestProvider(mocLocationProvider, false, false,
                           false, false, true, true, true, 1, 2);
        lm.setTestProviderEnabled(mocLocationProvider, true);

        //49.2522, -123.2465 (STARTING LAT / LONG)
        Location loc = new Location(mocLocationProvider);
        Location mockLocation = new Location(mocLocationProvider); // a string
        mockLocation.setLatitude(49.2522);  // double
        mockLocation.setLongitude(-123.2465);
        mockLocation.setAltitude(loc.getAltitude());
        mockLocation.setTime(System.currentTimeMillis());
        mockLocation.setAccuracy(1);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            mockLocation.setElapsedRealtimeNanos(SystemClock.elapsedRealtimeNanos());
        }
        lm.setTestProviderLocation( mocLocationProvider, mockLocation);
        SystemClock.sleep(10000);

        //49.2620, -123.2578
        Location loc2 = new Location(mocLocationProvider);
        Location mockLocation2 = new Location(mocLocationProvider); // a string
        mockLocation2.setLatitude(49.2620);  // double
        mockLocation2.setLongitude(-123.2578);
        mockLocation2.setAltitude(loc2.getAltitude());
        mockLocation2.setTime(System.currentTimeMillis());
        mockLocation2.setAccuracy(1);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            mockLocation2.setElapsedRealtimeNanos(SystemClock.elapsedRealtimeNanos());
        }
        lm.setTestProviderLocation( mocLocationProvider, mockLocation2);
        SystemClock.sleep(10000);

        //49.2667, -123.2382
        Location loc3 = new Location(mocLocationProvider);
        Location mockLocation3 = new Location(mocLocationProvider); // a string
        mockLocation3.setLatitude(49.2667);  // double
        mockLocation3.setLongitude(-123.2382);
        mockLocation3.setAltitude(loc3.getAltitude());
        mockLocation3.setTime(System.currentTimeMillis());
        mockLocation3.setAccuracy(1);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            mockLocation3.setElapsedRealtimeNanos(SystemClock.elapsedRealtimeNanos());
        }
        lm.setTestProviderLocation( mocLocationProvider, mockLocation3);
        SystemClock.sleep(10000);

        //49.2571, -123.2310
        Location loc4 = new Location(mocLocationProvider);
        Location mockLocation4 = new Location(mocLocationProvider); // a string
        mockLocation4.setLatitude(49.2571);  // double
        mockLocation4.setLongitude(-123.2310);
        mockLocation4.setAltitude(loc4.getAltitude());
        mockLocation4.setTime(System.currentTimeMillis());
        mockLocation4.setAccuracy(1);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            mockLocation4.setElapsedRealtimeNanos(SystemClock.elapsedRealtimeNanos());
        }
        lm.setTestProviderLocation( mocLocationProvider, mockLocation4);
        SystemClock.sleep(10000);

        //BACK TO INITIAL POINT
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1) {
            mockLocation.setElapsedRealtimeNanos(SystemClock.elapsedRealtimeNanos());
        }
        lm.setTestProviderLocation( mocLocationProvider, mockLocation);
        SystemClock.sleep(10000);

        ViewInteraction button = onView(
                allOf(withId(R.id.stop_activity_button),
                      withText("Stop Activity"),
                      childAtPosition(
                              allOf(withId(R.id.linearLayout),
                                    childAtPosition(
                                            withId(android.R.id.content),
                                            0)),
                              3),
                      isDisplayed()));
        button.perform(click());
        clickCount++;

        //TODO ADD CHECK HERE (CHECK Area covered/Distance ran textView)
//        ViewInteraction linearLayout = onView(
//                allOf(withParent(withParent(IsInstanceOf.<View>instanceOf(
//                              android.widget.FrameLayout.class))),
//                      isDisplayed()));
//        linearLayout.check(matches(isDisplayed()));

        assert clickCount <= NR_MAX_CLICKS;
    }

    private static Matcher<View> childAtPosition(
            final Matcher<View> parentMatcher, final int position) {

        return new TypeSafeMatcher<View>() {
            @Override
            public void describeTo(Description description) {
                description.appendText(
                        "Child at position " + position + " in parent ");
                parentMatcher.describeTo(description);
            }

            @Override
            public boolean matchesSafely(View view) {
                ViewParent parent = view.getParent();
                return parent instanceof ViewGroup &&
                        parentMatcher.matches(parent)
                        &&
                        view.equals(((ViewGroup) parent).getChildAt(position));
            }
        };
    }
}