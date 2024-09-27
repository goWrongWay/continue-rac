import styled from "styled-components";
import { vscForeground } from "..";
import { hasPassedFTL } from "../../util/freeTrial";
import { BrowserLogin } from "./tabs";

interface OnboardingCardTabsProps {
  activeTab: TabTitle;
  onTabClick: (tabName: TabTitle) => void;
}

export type TabTitle = "Browser" | "WeChat" | "Email" | "Phone";

export const TabTitles: { [k in TabTitle]: { md: string; default: string } } = {
  Browser: {
    md: "Browser",
    default: "Browser",
  },
  WeChat: {
    md: "WeChat",
    default: "WeChat",
  },
  Email: {
    md: "Email",
    default: "Email",
  },
  Phone: {
    md: "Phone",
    default: "Phone",
  },
};

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  background-color: transparent;
  color: ${vscForeground};
  border: none;
  border-bottom: 1px solid ${vscForeground};
  border-radius: 0;
  font-size: 1rem;
  cursor: pointer;
  display: block;

  &:focus {
    outline: none;
  }
`;

const TabButton = styled.button<{ isActive: boolean }>`
  margin-bottom: -1px;
  focus: outline-none;
  background: transparent;
  cursor: pointer;
  color: ${vscForeground};
  border: none;

  ${({ isActive }) =>
    isActive &&
    `
    border-style: solid;
    border-width: 0 0 2.5px 0;
    border-color: ${vscForeground};
    font-weight: bold;
  `}
`;

const TabList = styled.div`
  border-style: solid;
  border-width: 0 0 0.5px 0;
  border-color: ${vscForeground};
`;

export function OnboardingCardTabs({
  activeTab,
  onTabClick,
}: OnboardingCardTabsProps) {
  return (
    <div>
      <div className="hidden xs:block">
        <TabList>
          {Object.entries(TabTitles).map(([tabType, titles]) => {
            if (hasPassedFTL() && tabType === "Quickstart") {
              return undefined;
            }

            return (
              <TabButton
                className="px-4 py-2 xs:py-2 xs:px-2 sm:px-4"
                key={tabType}
                isActive={activeTab === tabType}
                onClick={() => onTabClick(tabType as TabTitle)}
              >
                <p className="hidden md:block m-0 font-medium">
                  {titles.default}
                </p>
                <p className="block md:hidden m-0 font-medium">{titles.md}</p>
              </TabButton>
            );
          })}
        </TabList>
      </div>
      <div className="block xs:hidden">
        <StyledSelect
          value={activeTab}
          onChange={(e) => onTabClick(e.target.value as TabTitle)}
        >
          {Object.entries(TabTitles).map(([tabType, titles]) => {
            if (hasPassedFTL() && tabType === "Quickstart") {
              return null;
            }

            return (
              <option key={tabType} value={tabType}>
                {titles.md}
              </option>
            );
          })}
        </StyledSelect>
      </div>
    </div>
  );
}