import type { Props } from "@theme/Root";
import LinkClickTracker from "@site/src/components/LinkClickTracker";
import SearchTermTracker from "@site/src/components/SearchTermTracker";
import ScrollDepthTracker from "@site/src/components/ScrollDepthTracker";

export default function Root({ children }: Props): JSX.Element {
  return (
    <>
      <LinkClickTracker />
      <SearchTermTracker />
      <ScrollDepthTracker />
      {children}
    </>
  );
}
