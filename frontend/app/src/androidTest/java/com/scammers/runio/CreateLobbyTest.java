package com.scammers.runio;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.assertion.ViewAssertions.matches;
import static androidx.test.espresso.matcher.ViewMatchers.isDisplayed;
import static androidx.test.espresso.matcher.ViewMatchers.isEnabled;
import static androidx.test.espresso.matcher.ViewMatchers.withClassName;
import static androidx.test.espresso.matcher.ViewMatchers.withId;
import static androidx.test.espresso.matcher.ViewMatchers.withParent;
import static androidx.test.espresso.matcher.ViewMatchers.withText;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.Matchers.allOf;
import static org.hamcrest.Matchers.is;

import android.view.View;
import android.view.ViewGroup;
import android.view.ViewParent;

import androidx.test.espresso.ViewInteraction;
import androidx.test.ext.junit.rules.ActivityScenarioRule;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.filters.LargeTest;
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

import java.util.UUID;

@LargeTest
@RunWith(AndroidJUnit4.class)
public class CreateLobbyTest {

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
        device = UiDevice.getInstance(InstrumentationRegistry.
                                              getInstrumentation());
    }

    @Test
    public void createLobbyTest() throws UiObjectNotFoundException {
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

        device.wait(Until.hasObject(By.pkg(
                "com.google.android.gms.auth")), 5000);

        UiObject
                firstAccount = device.findObject(new UiSelector()
        .resourceId("com.google.android.gms:id/account_display_name").index(0));
        firstAccount.click();


        ViewInteraction button = onView(
                allOf(withId(R.id.lobbies_button_home), withText("Lobbies"),
                      withParent(withParent(withId(android.R.id.content))),
                      isDisplayed()));
        button.check(matches(isDisplayed()));

        ViewInteraction materialButton2 = onView(
                allOf(withId(R.id.lobbies_button_home), withText("Lobbies"),
                      childAtPosition(
                              childAtPosition(
                                      withId(android.R.id.content),
                                      0),
                              2),
                      isDisplayed()));
        materialButton2.perform(click());
        clickCount++;

        ViewInteraction button2 = onView(
                allOf(withId(R.id.create_lobby_button), withText("New Lobby"),
                      withParent(withParent(withId(android.R.id.content))),
                      isDisplayed()));
        button2.check(matches(isDisplayed()));

        ViewInteraction materialButton3 = onView(
                allOf(withId(R.id.create_lobby_button), withText("New Lobby"),
                      childAtPosition(
                              childAtPosition(
                                      withId(android.R.id.content),
                                      0),
                              1),
                      isDisplayed()));
        materialButton3.perform(click());
        clickCount++;

        ViewInteraction editText = onView(
                allOf(withId(R.id.new_lobby_name_form),
                      withParent(withParent(IsInstanceOf.<View>instanceOf(
                              android.view.ViewGroup.class))),
                      isDisplayed()));
        editText.check(matches(isDisplayed()));

        ViewInteraction button3 = onView(
                allOf(withId(R.id.new_lobby_submit_button),
                      withText("Create Lobby"),
                      withParent(withParent(IsInstanceOf.<View>instanceOf(
                              android.view.ViewGroup.class))),
                      isDisplayed()));
        button3.check(matches(not(isEnabled())));


        ViewInteraction appCompatEditText = onView(
                allOf(withId(R.id.new_lobby_name_form),
                      childAtPosition(
                              childAtPosition(
                                      withClassName(
                                      is("androidx.constraintlayout" +
                                                 ".widget" +
                                                 ".ConstraintLayout")),
                              0),
                              0),
                      isDisplayed()));
        String randomText = UUID.randomUUID().toString();
        appCompatEditText.perform(replaceText(randomText),
                                  closeSoftKeyboard());

        ViewInteraction materialButton4 = onView(
                allOf(withId(R.id.new_lobby_submit_button),
                      withText("Create Lobby"),
                      childAtPosition(
                              childAtPosition(
                                      withClassName(
                                          is("androidx.constraintlayout" +
                                                     ".widget" +
                                                     ".ConstraintLayout")),
                                  0),
                              1),
                      isDisplayed()));
        materialButton4.perform(click());
        clickCount++;

        ViewInteraction button4 = onView(
                allOf(withText(randomText),
                      withParent(allOf(withId(R.id.lobbiesLinearLayout),
                                       withParent(IsInstanceOf.<View>instanceOf(
                                               android.view.ViewGroup.class)))),
                      isDisplayed()));
        button4.check(matches(isDisplayed()));

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
