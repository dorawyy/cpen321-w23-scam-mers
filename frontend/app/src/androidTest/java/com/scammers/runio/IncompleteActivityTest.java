package com.scammers.runio;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withParent;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

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
import org.hamcrest.core.IsInstanceOf;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;

@RunWith(AndroidJUnit4.class)
public class IncompleteActivityTest {

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
    public void setUp() {
        device = UiDevice.getInstance(InstrumentationRegistry
                                              .getInstrumentation());
    }

    @Test
    public void incompleteActivityTest()
            throws InterruptedException, UiObjectNotFoundException {
        ViewInteraction id = onView(
                allOf(withText("Sign in"),
                      childAtPosition(
                              allOf(withId(R.id.sign_in_button),
                                    childAtPosition(
                                        withClassName(
                                                is("androidx" +
                                                       ".constraintlayout" +
                                                       ".widget" +
                                                       ".ConstraintLayout")),
                                        1)),
                              0),
                      isDisplayed()));
        id.perform(click());
        clickCount++;

        // Wait for the account picker to appear
        device.wait(Until.hasObject(By.pkg(
                "com.google.android.gms.auth")), 5000);

        // Find and click on the first Google account
        UiObject
                firstAccount = device.findObject(new UiSelector()
        .resourceId("com.google.android.gms:id/account_display_name").index(0));
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

        ViewInteraction linearLayout = onView(
                allOf(withParent(withParent(IsInstanceOf.<View>instanceOf(
                              android.widget.FrameLayout.class))),
                      isDisplayed()));
        linearLayout.check(matches(isDisplayed()));

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
