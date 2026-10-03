import { SITE } from "@/lib/constants/site";

export function LegalPage({ title, body }: { title: string; body: string }) {
  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-3xl prose prose-stone">
        <h1>{title}</h1>
        <p>{body.replace("{SITE}", SITE.name)}</p>
      </div>
    </div>
  );
}
