import * as Tabs from "./tabs";
import { TabTitle, OnboardingCardTabs } from "./LoginCardTabs";
import { XMarkIcon } from "@heroicons/react/24/outline";
import styled from "styled-components";
import { CloseButton, defaultBorderRadius, vscInputBackground } from "../";
import { getLocalStorage, setLocalStorage } from "../../util/localStorage";
import { useOnboardingCard } from "./hooks/useOnboardingCard";
import { useShowLoginCard } from "./hooks/useShowLoginCard";

const StyledCard = styled.div`
  border-radius: ${defaultBorderRadius};
  background-color: ${vscInputBackground};
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
`;

export interface OnboardingCardState {
  show?: boolean;
  activeTab?: TabTitle;
  close: any
}

export type OnboardingCardProps = Pick<OnboardingCardState, "activeTab">;

export function LoginCard(props: OnboardingCardProps) {
  const showLoginCard = useShowLoginCard();

  function renderTabContent() {
    switch (showLoginCard.activeTab) {
      case "Browser":
        return <Tabs.BrowserLogin />;
      case "WeChat":
        return <Tabs.Quickstart />;
      case "Email":
        return <Tabs.Best />;
      case "Phone":
        return <Tabs.Local />;
      default:
        return null;
    }
  }

  if (getLocalStorage("onboardingStatus") === undefined) {
    setLocalStorage("onboardingStatus", "Started");
  }

  return (
    <StyledCard className="relative px-2 py-3 mt-4 xs:py-4 xs:px-4">
      <OnboardingCardTabs
        activeTab={showLoginCard.activeTab}
        onTabClick={showLoginCard.setActiveTab}
      />
      <CloseButton onClick={showLoginCard.close}>
        <XMarkIcon className="h-5 w-5 hidden sm:flex" />
      </CloseButton>
      <div className="content py-4">{renderTabContent()}</div>
    </StyledCard>
  );
}
