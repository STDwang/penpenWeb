import { notFound } from "next/navigation";
import { workProjects } from "@/content/projects";
import { ProjectDetail } from "@/components/project-detail";
import { pageMeta } from "@/lib/site";

export const dynamicParams = false;
export function generateStaticParams() {
  return workProjects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = workProjects.find((p) => p.slug === slug);
  if (!p) return {};
  return pageMeta(p.title, p.summary, `/work/${slug}`);
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = workProjects.find((p) => p.slug === slug);
  if (!p) notFound();
  return <ProjectDetail project={p} />;
}
