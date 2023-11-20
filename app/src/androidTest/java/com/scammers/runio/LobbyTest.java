package com.scammers.runio;

import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.typeText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withText;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.instanceOf;

import android.Manifest;

import androidx.test.core.app.ActivityScenario;
import androidx.test.espresso.Espresso;
import androidx.test.espresso.ViewInteraction;
import androidx.test.espresso.action.ViewActions;
import androidx.test.espresso.matcher.ViewMatchers;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.rule.GrantPermissionRule;
import androidx.test.uiautomator.By;
import androidx.test.uiautomator.UiDevice;
import androidx.test.uiautomator.UiObject;
import androidx.test.uiautomator.UiObject2;
import androidx.test.uiautomator.UiObjectNotFoundException;
import androidx.test.uiautomator.UiSelector;
import androidx.test.uiautomator.Until;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
@LargeTest
public class LobbyTest {

    private UiDevice device;

    @Before
    public void setUp() {
        device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
    }

    @Rule
    public ActivityScenarioRule<MainActivity> activityRule =
            new ActivityScenarioRule<>(MainActivity.class);

//    @Rule public GrantPermissionRule
//            permissionRule1 = GrantPermissionRule.grant(android.Manifest.permission.ACCESS_FINE_LOCATION);
//    @Rule public GrantPermissionRule
//            permissionRule2 = GrantPermissionRule.grant(Manifest.permission.ACCESS_COARSE_LOCATION);
    @Test
    public void check_create_lobby() throws UiObjectNotFoundException {
        // start on main activity
        // click sign in with google
        // pick first account
        // then click lobbies button
        // Find and click on the Google Sign-In button

//        ViewInteraction sign_in_button = Espresso.onView(withId(R.id.sign_in_button));
//        sign_in_button.perform(click());
//        // Wait for the account picker to appear
//        device.wait(Until.hasObject(By.pkg("com.google.android.gms.auth")), 5000);
//
//        // Find and click on the first Google account
//        UiObject
//                firstAccount = device.findObject(new UiSelector().resourceId("com.google.android.gms:id/account_display_name").index(0));
//        firstAccount.click();
//
//        Espresso.onView(withId(R.id.lobbies_button_home)).check(matches(isDisplayed()));

//        ViewInteraction button = Espresso.onView(withId(R.id.create_lobby_button));
//        // Perform click action on the button
//        button.perform(click());
//
//        Espresso.onView(withId(R.id.new_lobby_submit_button)).check(matches(isDisplayed()));
//
//        Espresso.onView(withId(R.id.new_lobby_name_form)).check(matches(isDisplayed()));
//        Espresso.onView(withId(R.id.new_lobby_name_form)).perform(click(), typeText("EspressoTestLobby"), closeSoftKeyboard());
//
////        Espresso.closeSoftKeyboard();
//
//        // Click the submit create lobby button
//        ViewInteraction submitButton = Espresso.onView(withId(R.id.new_lobby_submit_button));
//        // Perform click action on the button
//        submitButton.perform(ViewActions.scrollTo(), click());
//        Espresso.onView(withText("Created new lobby: EspressoTestLobby")).inRoot(new ToastMatcher()).check(matches(isDisplayed()));


    }

}
