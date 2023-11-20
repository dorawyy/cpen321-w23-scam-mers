package com.scammers.runio;


import static androidx.test.espresso.Espresso.onView;
import static androidx.test.espresso.action.ViewActions.click;
import static androidx.test.espresso.action.ViewActions.closeSoftKeyboard;
import static androidx.test.espresso.action.ViewActions.replaceText;
import static androidx.test.espresso.action.ViewActions.scrollTo;
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

import androidx.test.espresso.Espresso;
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

@LargeTest
@RunWith(AndroidJUnit4.class)
public class CreateLobbyTest2 {

    @Rule
    public ActivityScenarioRule<MainActivity> mActivityScenarioRule =
            new ActivityScenarioRule<>(MainActivity.class);

    @Rule
    public GrantPermissionRule mGrantPermissionRule =
            GrantPermissionRule.grant(
                    "android.permission.ACCESS_FINE_LOCATION",
                    "android.permission.ACCESS_COARSE_LOCATION");

    private UiDevice device;

    @Before
    public void setUp() {
        device = UiDevice.getInstance(InstrumentationRegistry.getInstrumentation());
    }

    @Test
    public void createLobbyTest2() throws UiObjectNotFoundException {
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

//        ViewInteraction sign_in_button = Espresso.onView(withId(R.id.sign_in_button));
//        sign_in_button.perform(click());
        // Wait for the account picker to appear
        device.wait(Until.hasObject(By.pkg("com.google.android.gms.auth")), 5000);

        // Find and click on the first Google account
        UiObject
                firstAccount = device.findObject(new UiSelector().resourceId("com.google.android.gms:id/account_display_name").index(0));
        firstAccount.click();

//        ViewInteraction materialButton = onView(
//                allOf(withId(android.R.id.button1), withText("AGREE"),
//                      childAtPosition(
//                              childAtPosition(
//                                      withClassName(
//                                              is("android.widget.ScrollView")),
//                                      0),
//                              3)));
//        materialButton.perform(scrollTo(), click());

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
        button3.check(matches(isDisplayed()));

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
        appCompatEditText.perform(replaceText("TestEspresso"),
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

        ViewInteraction appCompatImageButton = onView(
                allOf(withId(R.id.home_button_lobbies),
                      childAtPosition(
                              allOf(withId(R.id.lobbiesConstraintLayout),
                                    childAtPosition(
                                            withClassName(
                                                    is("androidx.constraintlayout.widget.ConstraintLayout")),
                                            0)),
                              0),
                      isDisplayed()));
        appCompatImageButton.perform(click());

        ViewInteraction materialButton5 = onView(
                allOf(withId(R.id.lobbies_button_home), withText("Lobbies"),
                      childAtPosition(
                              childAtPosition(
                                      withId(android.R.id.content),
                                      0),
                              2),
                      isDisplayed()));
        materialButton5.perform(click());

        ViewInteraction button4 = onView(
                allOf(withText("TESTESPRESSO"),
                      withParent(allOf(withId(R.id.lobbiesLinearLayout),
                                       withParent(IsInstanceOf.<View>instanceOf(
                                               android.view.ViewGroup.class)))),
                      isDisplayed()));
        button4.check(matches(isDisplayed()));
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
