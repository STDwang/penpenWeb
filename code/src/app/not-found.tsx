import Link from "next/link";
import { Arrow } from "@/components/ui";

export default function NotFound() {
  return (
    <main id="main" className="container not-found">
      <p className="eyebrow accent">404 / ROUTE NOT FOUND</p>
      <h1>这条路径还没有建好。</h1>
      <p>可以回到首页，或从工程案例继续了解我的工作。</p>
      <Link className="button primary" href="/">
        返回首页
        <Arrow />
      </Link>
      <Link className="text-link" href="/work">
        浏览工程案例
        <Arrow />
      </Link>
    </main>
  );
}
