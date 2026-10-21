import { test, expect } from "@playwright/test";
import { resolve } from "node:path";

test("homepage, scene playback, seeking and keyboard selection", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "让复杂系统",
  );
  await expect(page.getByRole("button", { name: "播放演示" })).toBeVisible();
  const progress = page.getByLabel("演示进度（秒）");
  await expect(progress).toHaveValue("12");
  await progress.focus();
  await page.keyboard.press("ArrowRight");
  await expect(progress).toHaveValue("12.1");
  const car = page.getByRole("button", { name: "选择车辆 028，合流轨迹" });
  await car.focus();
  await page.keyboard.press("Enter");
  await expect(car).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("status").filter({ hasText: "已选择车辆" }),
  ).toContainText("028");
  await page.getByRole("button", { name: "播放演示" }).click();
  await expect(page.getByRole("button", { name: "暂停演示" })).toBeVisible();
  await expect
    .poll(async () => Number(await progress.inputValue()))
    .toBeGreaterThan(12.1);
  await page.getByRole("button", { name: "暂停演示" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByText("已遵循减少动态效果设置", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "播放演示" })).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  await page.reload();
  await page.locator(".lab-card img").first().scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs.every(
            (img) =>
              img instanceof HTMLImageElement &&
              img.complete &&
              img.naturalWidth > 0,
          ),
        ),
    )
    .toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: resolve("../previews", `site-${testInfo.project.name}.png`),
    fullPage: true,
  });
});

test("real navigation, detail routes, PDF and noindex", async ({
  page,
  request,
}, testInfo) => {
  await page.goto("/");
  if (testInfo.project.name === "mobile") {
    const menu = page.getByRole("button", { name: "打开导航" });
    await menu.click();
    await expect(
      page.getByRole("navigation", { name: "主导航" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  }
  await page.getByRole("link", { name: "查看工程案例", exact: true }).click();
  await expect(page).toHaveURL(/\/work$/);
  await page
    .getByRole("heading", { name: "轨道交通仿真模块" })
    .getByRole("link")
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "轨道交通仿真模块",
  );
  for (const route of [
    "/work/layers-picking",
    "/work/micro-meso",
    "/lab",
    "/lab/gpuview",
    "/lab/dreamscape",
    "/lab/mistloop",
    "/lab/imageplayer",
    "/about",
    "/resume",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /.+/,
    );
  }
  const pdf = await request.get("/resume/wang-shuaipeng.pdf");
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /",
  );
  expect((await request.get("/work/not-a-case")).status()).toBe(404);
  const missing = await page.goto("/not-a-real-page");
  expect(missing?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "这条路径还没有建好。" }),
  ).toBeVisible();
});

test("server-rendered content and static scene work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("可验证");
  await expect(page.getByText("固定演示数据 · 非真实仿真输出")).toBeVisible();
  await page.getByRole("link", { name: "查看工程案例", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "把问题做透",
  );
  await context.close();
});
