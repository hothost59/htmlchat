
from playwright.sync_api import sync_playwright, expect
import time
import os

def test_automod(page):
    # Go to the local server
    page.goto("http://localhost:8000/index.html")

    # Mock the BLACKLIST
    page.evaluate("BLACKLIST = ['badword']")

    # Switch to signup mode
    # The 'Register' link is in the footer
    page.get_by_text("Register").click()

    # Wait for the signup form to appear
    expect(page.get_by_text("Create an account")).to_be_visible()

    # Try signing up with a banned username
    page.fill("#authUsername", "badword")
    page.fill("#authPassword", "Password123!")
    page.fill("#authConfirm", "Password123!")
    page.click("#submitBtn")

    # Check for the error message
    expect(page.locator("#authMessage")).to_have_text("Username not allowed")

    # Take a screenshot
    os.makedirs("/home/jules/verification", exist_ok=True)
    page.screenshot(path="/home/jules/verification/blocked_signup_banned.png")
    print("Screenshot saved: blocked_signup_banned.png")

    # Try signing up with a dm__ username
    page.fill("#authUsername", "dm__admin")
    page.click("#submitBtn")
    expect(page.locator("#authMessage")).to_have_text("Username cannot start with 'dm__' or contain '__'")
    page.screenshot(path="/home/jules/verification/blocked_signup_dm.png")
    print("Screenshot saved: blocked_signup_dm.png")

    # Try signing up with __ username
    page.fill("#authUsername", "user__name")
    page.click("#submitBtn")
    expect(page.locator("#authMessage")).to_have_text("Username cannot start with 'dm__' or contain '__'")
    print("Verified __ blocking")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_automod(page)
        finally:
            browser.close()
