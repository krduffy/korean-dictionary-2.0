import { test, expect } from "@playwright/test";

type PanelVisibilityDomElement =
  | "left-panel"
  | "right-panel"
  | "make-left-panel-visible-button"
  | "make-right-panel-visible-button"
  | "close-left-panel-button"
  | "close-right-panel-button";

test.describe("panel visibility tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");
  });

  const getLocators = ({ page }) => {
    return {
      "left-panel": page.getByLabel("left-panel"),
      "make-left-panel-visible-button": page.getByTestId(
        "make-left-panel-visible-button"
      ),
      "close-left-panel-button": page
        .getByLabel("left-panel")
        .getByLabel("panel-top-bar")
        .getByTitle("사전창 닫기"),
      "right-panel": page.getByLabel("right-panel"),
      "make-right-panel-visible-button": page.getByTestId(
        "make-right-panel-visible-button"
      ),
      "close-right-panel-button": page
        .getByLabel("right-panel")
        .getByLabel("panel-top-bar")
        .getByTitle("사전창 닫기"),
    };
  };

  const expectLocatorCounts = async (
    locators: ReturnType<typeof getLocators>,
    counts: Partial<Record<PanelVisibilityDomElement, number>>
  ) => {
    for (const [element, count] of Object.entries(counts)) {
      await expect(locators[element]).toHaveCount(count);
    }
  };

  test("can hide visibility of left panel", async ({ page }) => {
    const locators = getLocators({ page });

    await expectLocatorCounts(locators, {
      "left-panel": 1,
      "close-left-panel-button": 1,
    });

    await locators["close-left-panel-button"].click();

    await expectLocatorCounts(locators, {
      "left-panel": 0,
      "close-left-panel-button": 0,
      "make-left-panel-visible-button": 1,
    });
  });

  test("right panel availability depends on screen width", async ({ page }) => {
    const locators = getLocators({ page });

    await page.setViewportSize({ height: 400, width: 1280 });

    await expectLocatorCounts(locators, {
      "make-right-panel-visible-button": 1,
    });

    await page.setViewportSize({ height: 400, width: 400 });

    await expectLocatorCounts(locators, {
      "make-right-panel-visible-button": 0,
    });
  });

  test("can have right panel without left panel", async ({ page }) => {
    const locators = getLocators({ page });
    await page.setViewportSize({ height: 400, width: 1280 });

    await locators["close-left-panel-button"].click();
    await expectLocatorCounts(locators, {
      "left-panel": 0,
      "close-left-panel-button": 0,
      "make-left-panel-visible-button": 1,
      "right-panel": 0,
      "close-right-panel-button": 0,
      "make-right-panel-visible-button": 1,
    });

    await locators["make-right-panel-visible-button"].click();

    await expectLocatorCounts(locators, {
      "left-panel": 0,
      "close-left-panel-button": 0,
      "make-left-panel-visible-button": 1,
      "right-panel": 1,
      "close-right-panel-button": 1,
      "make-right-panel-visible-button": 0,
    });
  });
});
