import { person } from "@/lib/site";
import { TextLink } from "./ui";

export function Contact() {
  return (
    <section className="contact-box" aria-labelledby="contact-title">
      <p className="eyebrow">LET’S BUILD RELIABLE SYSTEMS</p>
      <h2 id="contact-title">有合适的仿真平台机会，欢迎聊聊。</h2>
      <div className="contact-links">
        <a href="tel:13849489395">{person.phone}</a>
        <a href={`mailto:${person.email}`}>{person.email}</a>
        <TextLink href="/resume">查看简历</TextLink>
      </div>
    </section>
  );
}
export function Footer() {
  return (
    <footer className="site-footer container">
      <span className="mono">
        © {new Date().getFullYear()} 王帅鹏 / STDwang
      </span>
      <div>
        <TextLink href={person.github} external>
          GitHub
        </TextLink>
        <TextLink href={person.blog} external>
          CSDN
        </TextLink>
      </div>
    </footer>
  );
}
