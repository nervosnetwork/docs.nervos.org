import useDocusaurusContext from "@docusaurus/useDocusaurusContext";

export default function ExampleLink({
  path,
  children,
}: {
  path: string;
  children: React.ReactNode;
}) {
  const config = useDocusaurusContext();
  const examplesBaseUrl = config.siteConfig.customFields?.examplesBaseUrl;
  return <a href={`${examplesBaseUrl}${path}`}>{children}</a>;
}
