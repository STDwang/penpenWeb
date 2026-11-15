import { test, expect } from "@playwright/test";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/portfolio";
const sitePath = (path: string) => `${basePath}${path}`;

test("homepage is one scrolling page and the header reaches every section", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  // 静态导出下 Link 预取的 RSC 分段文件会 404（既有问题，导航会回退到整页加载），这里只拦脚本错误。
  page.on("console", (message) => { if (message.type() === "error" && !message.text().startsWith("Failed to load resource")) errors.push(message.text()); });
  await page.goto(sitePath("/"));

  await expect(page.getByRole("heading", { level: 1 })).toContainText("让复杂世界");
  await expect(page.getByRole("img", { name: "王帅鹏的半身像" })).toBeVisible();
  await expect(page.locator(".scene-frame")).toHaveCount(0);
  const nav = page.getByRole("navigation", { name: "主导航" });
  const jump = async (name: string) => {
    if (testInfo.project.name === "mobile") await page.getByRole("button", { name: "打开导航" }).click();
    await nav.getByRole("link", { name }).click();
  };

  await jump("工作成果");
  await expect(page).toHaveURL(/#work$/);
  const work = page.locator("#work");
  await expect(work.getByRole("heading", { level: 2 })).toBeInViewport();
  await expect(work.getByRole("link", { name: /轨道交通仿真模块/ })).toBeVisible();
  await expect(work.locator(".hm-row")).toHaveCount(4);

  await jump("个人项目");
  const lab = page.locator("#lab");
  await expect(lab.getByRole("heading", { level: 2 })).toBeInViewport();
  await expect(lab.getByRole("link", { name: "Dreamscape · 梦境废墟" })).toBeVisible();
  await expect(lab.getByRole("link", { name: /项目展示/ })).toHaveAttribute("href", "https://stdwang.github.io/dreamscape/");

  await jump("游戏橱窗");
  const arcade = page.locator("#games");
  await expect(arcade.getByRole("heading", { level: 2 })).toBeInViewport();
  const tabs = arcade.getByRole("tablist", { name: "选择游戏" });
  await expect(tabs.getByRole("tab")).toHaveCount(5);
  await tabs.getByRole("tab", { name: /梦境废墟/ }).click();
  const panel = arcade.getByRole("tabpanel");
  await expect(panel.getByRole("heading", { name: "梦境废墟" })).toBeVisible();
  await expect(panel.getByRole("link", { name: /直接试玩/ })).toHaveAttribute("href", "https://stdwang.github.io/dreamscape/");
  await page.keyboard.press("ArrowRight");
  await expect(panel.getByRole("heading", { name: "黑暗童话" })).toBeVisible();
  await expect(panel.getByText("源码未公开")).toBeVisible();

  await jump("关于");
  await expect(page.getByRole("link", { name: /阅读完整经历/ })).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("home work index previews the hovered case and opens its detail page", async ({ page }, testInfo) => {
  await page.goto(sitePath("/#work"));
  const row = page.locator("#work").getByRole("link", { name: /编辑图层与复杂场景拾取/ });
  if (testInfo.project.name === "desktop") {
    await expect(page.locator(".hm-preview-stage img.is-active")).toHaveAttribute("src", /rail-transit/);
    await row.hover();
    await expect(page.locator(".hm-preview-stage img.is-active")).toHaveAttribute("src", /layers-picking/);
  } else {
    await expect(page.locator(".hm-preview")).toBeHidden();
    await expect(row.locator(".hm-row-thumb")).toBeVisible();
  }
  await row.click();
  await expect(page).toHaveURL(/\/work\/layers-picking\/?$/);
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
  await expect(lab.getByRole("link", { name: /项目展示/ })).toHaveAttribute("href", "https://stdwang.github.io/dreamscape/");

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
  await page.goto(sitePath("/#contact"));
  await expect(page.getByRole("link", { name: /阅读完整经历/ })).toBeInViewport();
  await page.goto(sitePath("/work"));
  const work = page.getByRole("region", { name: "工程案例" });
  await work.focus();
  await page.keyboard.press("ArrowRight");
  await expect(work.getByRole("heading", { name: "编辑图层与复杂场景拾取" })).toBeVisible();

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(sitePath("/"));
  await expect(page.locator("#contact [data-reveal]").first()).toHaveCSS("opacity", "1");

  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const staticPage = await context.newPage();
  await staticPage.goto(sitePath("/"));
  await expect(staticPage.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(staticPage.locator("#work").getByRole("link", { name: /中观仿真与微中观协同/ })).toBeVisible();
  await expect(staticPage.locator("#contact").getByRole("link", { name: /阅读完整经历/ })).toBeVisible();
  await staticPage.goto(sitePath("/work"));
  await expect(staticPage.getByRole("link", { name: /中观仿真与微中观协同/ })).toBeVisible();
  await context.close();
});
