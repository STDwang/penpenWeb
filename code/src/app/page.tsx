import { pageMeta } from "@/lib/site";
import { HomeStage } from "@/components/home-stage";

export const metadata = pageMeta(
  "C++ / 仿真平台工程师",
  "王帅鹏：四年 C++ / Qt 商业仿真研发，轨道模块、专业编辑器、微中观协同与个人项目。",
  "/",
);

export default function Home() {
  return <HomeStage />;
}
