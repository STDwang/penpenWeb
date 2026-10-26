import { test, expect } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/portfolio";
const sitePath = (path: string) => `${basePath}${path}`;

test("homepage gives direct access to every section and both carousels", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(sitePath("/"));

  await expect(page.getByRole("heading", { level: 1 })).toContainText("让复杂世界");
  const character = page.locator(".scene-frame.is-active");
  await expect(character).toHaveAttribute("src", /white-studio-intro/);
  const nav = page.getByRole("navigation", { name: "主导航" });
  await expect(page.locator(".stage-nav")).toHaveCount(0);

  if (testInfo.project.name === "mobile") await page.getByRole("button", { name: "打开导航" }).click();
  await nav.getByRole("link", { name: "工作成果" }).click();
  await expect(page.locator(".scene-home")).toHaveAttribute("data-scene", "work");
  await expect(page.locator(".scene-home")).toHaveAttribute("data-pose", "present");
  await expect(page.locator(".scene-frame.is-active")).toHaveAttribute("src", /white-studio-present/);
  await expect(page.getByRole("region", { name: "工作成果", exact: true })).toBeVisible();
  const workCard = page.locator(".scene-screen-work .feature-card.is-current");
  await expect(workCard.locator(".feature-media")).toBeVisible();
  await expect(workCard.locator(".feature-card-copy")).toContainText("轨道交通仿真模块");
  await expect(page.locator(".scene-screen-work .feature-card-detail")).toHaveCount(4);
  await expect(page.getByRole("region", { name: "工作成果", exact: true }).locator(".feature-controls")).toHaveCount(0);
  await page.getByRole("region", { name: "工作成果", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(workCard.locator(".feature-card-copy")).toContainText("编辑图层与复杂场景拾取");
  await expect(page).toHaveURL(/#work$/);

  if (testInfo.project.name === "mobile") await page.getByRole("button", { name: "打开导航" }).click();
  await nav.getByRole("link", { name: "个人项目" }).click();
  await expect(page.locator(".scene-home")).toHaveAttribute("data-scene", "lab");
  await expect(page.locator(".scene-home")).toHaveAttribute("data-pose", "present");
  await expect(page.getByRole("region", { name: "个人项目", exact: true })).toBeVisible();
  await page.getByRole("region", { name: "个人项目", exact: true }).getByRole("button", { name: /显示Dreamscape/ }).click();
  await expect(page.locator(".scene-screen-lab .feature-card.is-current .feature-card-copy")).toContainText("Dreamscape");

  if (testInfo.project.name === "mobile") await page.getByRole("button", { name: "打开导航" }).click();
  await nav.getByRole("link", { name: "关于" }).click();
  await expect(page.getByRole("link", { name: /阅读完整经历/ })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("header navigation drives device scenes on the homepage", async ({ page }, testInfo) => {
  await page.goto(sitePath("/"));
  if (testInfo.project.name === "mobile") await page.getByRole("button", { name: "打开导航" }).click();
  await page.getByRole("navigation", { name: "主导航" }).getByRole("link", { name: "工作成果" }).click();
  await expect(page.locator(".scene-home")).toHaveAttribute("data-scene", "work");
  await expect(page.locator(".scene-screen-work")).toBeVisible();
  if (testInfo.project.name === "mobile") await page.getByRole("button", { name: "打开导航" }).click();
  await page.getByRole("navigation", { name: "主导航" }).getByRole("link", { name: "个人项目" }).click();
  await expect(page.locator(".scene-home")).toHaveAttribute("data-scene", "lab");
  await expect(page.locator(".scene-screen-lab")).toBeVisible();
});

test("work and lab pages let visitors choose projects and open evidence", async ({ page, request }, testInfo) => {
  await page.goto(sitePath("/work"));
  const work = page.getByRole("region", { name: "工程案例" });
  await expect(work.getByRole("heading", { name: "轨道交通仿真模块" })).toBeVisible();
  if (testInfo.project.name === "mobile") {
    const bounds = await work.locator(".feature-deck").boundingBox();
    if (!bounds) throw new Error("Missing carousel image bounds");
    const cdp = await page.context().newCDPSession(page);
    const y = bounds.y + bounds.height / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: bounds.x + bounds.width - 35, y }] });
    for (let step = 1; step <= 6; step++) {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: bounds.x + bounds.width - 35 - step * 28, y }] });
    }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(work.getByRole("heading", { name: "编辑图层与复杂场景拾取" })).toBeVisible();
    await cdp.detach();
  }
  await work.getByRole("button", { name: "显示中观仿真与微中观协同" }).click();
  await expect(work.getByRole("heading", { name: "中观仿真与微中观协同" })).toBeVisible();
  await work.getByRole("link", { name: /查看中观仿真与微中观协同详情/ }).click();
  await expect(page).toHaveURL(/\/work\/micro-meso\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("中观仿真与微中观协同");

  await page.goto(sitePath("/lab"));
  const lab = page.getByRole("region", { name: "个人项目" });
  await lab.getByRole("button", { name: "下一项个人项目" }).click();
  await expect(lab.getByRole("heading", { name: "Dreamscape" })).toBeVisible();
  await expect(lab.getByRole("link", { name: /项目展示/ })).toHaveAttribute("href", "https://dreamscape-cat.app.workbuddy.host/");

  for (const route of ["/work/rail-transit", "/work/layers-picking", "/work/emissions", "/lab/gpuview", "/lab/dreamscape", "/lab/mistloop", "/lab/imageplayer", "/about", "/resume"]) {
    const response = await page.goto(sitePath(route));
    expect(response?.status(), route).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route).toBe(true);
  }
  const pdf = await request.get(sitePath("/resume/wang-shuaipeng.pdf"));
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("key navigation, direct section links and no-script route access", async ({ page, browser }) => {
  await page.goto(sitePath("/#work"));
  const work = page.getByRole("region", { name: "工作成果", exact: true });
  await expect(work).toBeVisible();
  await work.focus();
  await page.keyboard.press("ArrowRight");
  await expect(work.getByRole("heading", { name: "编辑图层与复杂场景拾取" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(work.locator(".feature-card.is-current .feature-card-detail")).toBeVisible();

  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await context.newPage();
  await staticPage.goto(sitePath("/"));
  await expect(staticPage.getByRole("heading", { level: 1 })).toBeVisible();
  await staticPage.goto(sitePath("/work"));
  await expect(staticPage.getByRole("link", { name: /中观仿真与微中观协同/ })).toBeVisible();
  await context.close();
});
