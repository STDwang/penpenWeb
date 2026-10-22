import { test, expect } from "@playwright/test";
import { resolve } from "node:path";

// Browser navigation and public assets must both include the static-host subpath.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/portfolio";
const sitePath = (path: string) => `${basePath}${path}`;

test("homepage, scene playback, seeking and keyboard selection", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(sitePath("/"));
  const header = page.getByRole("banner");
  const headerBounds = await header.boundingBox();
  if (!headerBounds) throw new Error("Missing header bounds");
  expect(headerBounds.x).toBeCloseTo(0, 0);
  expect(headerBounds.width).toBeCloseTo(await page.evaluate(() => document.documentElement.clientWidth), 0);
  const logoBounds = await header.locator(".logo").boundingBox();
  const mainBounds = await page.locator("main").boundingBox();
  expect(logoBounds?.x).toBeCloseTo(mainBounds?.x ?? -1, 0);
  await expect(header).toHaveCSS("backdrop-filter", "blur(36px) saturate(1.65)");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "C++ / 仿真平台",
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
  // Offscreen rail slides remain lazy: visit every image before asserting load.
  for (const img of await page.locator("img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  await page.locator(".rail-track").evaluateAll((tracks) => tracks.forEach((track) => track.scrollTo({ left: 0, behavior: "instant" })));
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
    path: resolve(
      "../previews",
      `${process.env.SCREENSHOT_PREFIX || "site"}-${testInfo.project.name}.png`,
    ),
    fullPage: true,
  });
});

test("real navigation, detail routes, PDF and noindex", async ({
  page,
  request,
}, testInfo) => {
  await page.goto(sitePath("/"));
  await expect(page.getByRole("link", { name: "下载简历", exact: true })).toHaveAttribute("href", sitePath("/resume/wang-shuaipeng.pdf"));
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
  await expect(page).toHaveURL(/\/work\/?$/);
  await page
    .getByRole("heading", { name: "轨道交通仿真模块" })
    .getByRole("link")
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "轨道交通仿真模块",
  );
  for (const route of [
    "/work/layers-picking",
    "/work/emissions",
    "/work/micro-meso",
    "/lab",
    "/lab/gpuview",
    "/lab/dreamscape",
    "/lab/mistloop",
    "/lab/imageplayer",
    "/about",
    "/resume",
  ]) {
    const response = await page.goto(sitePath(route));
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
  const pdf = await request.get(sitePath("/resume/wang-shuaipeng.pdf"));
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
  expect(await (await request.get(sitePath("/robots.txt"))).text()).toContain(
    "Disallow: /",
  );
  expect((await request.get(sitePath("/work/not-a-case"))).status()).toBe(404);
  const missing = await page.goto(sitePath("/not-a-real-page"));
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
  await page.goto(sitePath("/"));
  await expect(page.getByRole("heading", { level: 1 })).toContainText("工程师");
  await expect(page.getByText("固定演示数据 · 非真实仿真输出")).toBeVisible();
  await page.getByRole("link", { name: "查看工程案例", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "把问题做透",
  );
  await page
    .getByRole("heading", { name: "中观仿真与微中观协同" })
    .getByRole("link")
    .click();
  await expect(page).toHaveURL(/\/work\/micro-meso\/?$/);
  await context.close();
});

test("project galleries scroll by controls, keyboard and touch; evidence stays attributed", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(sitePath("/"));
  const work = page.getByRole("region", { name: "工程案例", exact: true });
  const track = work.getByRole("list");
  await work.scrollIntoViewIfNeeded();
  await expect(
    work.getByRole("button", { name: "上一项工程案例" }),
  ).toBeDisabled();
  await work.getByRole("button", { name: "下一项工程案例" }).click();
  await expect
    .poll(() => track.evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(30);
  await track.focus();
  await page.keyboard.press("End");
  await expect(
    work.getByRole("button", { name: "下一项工程案例" }),
  ).toBeDisabled();
  await page.keyboard.press("Home");
  await expect.poll(() => track.evaluate((e) => e.scrollLeft)).toBeLessThan(3);
  await page.keyboard.press("ArrowRight");
  await expect
    .poll(() => track.evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(30);
  await expect(work.locator(".image-credit")).toHaveCount(4);
  await expect(work.locator(".work-card h3")).toHaveText([
    "轨道交通仿真模块", "编辑图层与复杂场景拾取", "排放模块与结果可视化", "中观仿真与微中观协同",
  ]);
  const filenames = ["rail-transit", "layers-picking", "emissions", "micro-meso"];
  for (let i = 0; i < filenames.length; i++) {
    await expect(work.locator(".work-card img").nth(i)).toHaveAttribute("src", sitePath(`/images/${filenames[i]}.webp`));
  }
  for (const credit of await work.locator(".image-credit").all()) {
    await expect(credit).toContainText("本人提供");
  }
  if (testInfo.project.name === "mobile") {
    // Real Chromium touch input rather than synthetic DOM events.
    await track.evaluate((e) => e.scrollTo({ left: 0, behavior: "instant" }));
    const rect = await track.boundingBox();
    if (!rect) throw new Error("Missing gallery bounds");
    const cdp = await page.context().newCDPSession(page);
    const y = Math.min(rect.y + 110, 700);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: rect.x + rect.width - 30, y }],
    });
    for (let step = 1; step <= 8; step++) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: rect.x + rect.width - 30 - step * 28, y }],
      });
    }
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect
      .poll(() => track.evaluate((e) => e.scrollLeft))
      .toBeGreaterThan(30);
    await cdp.detach();
  }
  const lab = page.getByRole("region", { name: "个人作品", exact: true });
  await lab.scrollIntoViewIfNeeded();
  await lab.getByRole("button", { name: "下一项个人作品" }).click();
  await expect
    .poll(() => lab.getByRole("list").evaluate((e) => e.scrollLeft))
    .toBeGreaterThan(30);
  await expect(
    lab.getByRole("link", { name: "项目展示 ↗", exact: true }),
  ).toHaveAttribute("href", "https://dreamscape-cat.app.workbuddy.host/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto(sitePath("/work/rail-transit"));
  await expect(
    page.getByRole("heading", { name: "我负责的工程链路" }),
  ).toBeVisible();
  await expect(page.locator("#boundary")).toContainText("对应负责的轨道交通模块");
});

test("module images and ImagePlayer screenshot gallery use local sanitized assets", async ({ page, request }, testInfo) => {
  for (const name of ["rail-transit", "layers-picking", "emissions", "micro-meso", "imageplayer", "imageplayer-photo", "imageplayer-medical"]) {
    const image = await request.get(sitePath(`/images/${name}.webp`));
    expect(image.status()).toBe(200);
    expect(image.headers()["content-type"]).toContain("image/webp");
  }
  await page.goto(sitePath("/lab/imageplayer/"));
  const gallery = page.getByRole("region", { name: "ImagePlayer 运行截图", exact: true });
  await expect(gallery.getByRole("listitem")).toHaveCount(2);
  await expect(page.locator(".image-imageplayer img")).toHaveAttribute("src", sitePath("/images/imageplayer.webp"));
  await expect(page.locator("#boundary")).toContainText("非医疗诊断软件");
  await gallery.scrollIntoViewIfNeeded();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await gallery.getByRole("list").focus();
  await page.keyboard.press("End");
  await expect(gallery.getByRole("button", { name: "下一项ImagePlayer 运行截图" })).toBeDisabled();
  const medical = gallery.getByRole("link", { name: /查看完整截图：.*网上示例牙片/ });
  await expect(medical).toHaveAttribute("href", sitePath("/images/imageplayer-medical.webp"));
  await expect(medical.locator("img")).toBeVisible();
  await expect.poll(() => medical.locator("img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: resolve("../previews", `${process.env.SCREENSHOT_PREFIX || "site"}-imageplayer-${testInfo.project.name}.png`), fullPage: true });
});
