import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  defaultBorderRadius,
  VSC_BADGE_BACKGROUND_VAR,
  VSC_EDITOR_BACKGROUND_VAR, VSC_INPUT_BACKGROUND_VAR, VSC_SIDEBAR_BORDER_VAR,
  vscBackground,
  vscEditorBackground,
  vscForeground, vscListActiveBackground,
} from "..";
import { Trans, useTranslation } from "react-i18next";
import { CheckIcon } from "@heroicons/react/24/outline";
import { User, Translate, Cube, CaretDoubleRight } from "@phosphor-icons/react";
import LanguageSwitcher from "./LanguageSwitcher";
import avatarDarkSVG from "../../../public/media/raccoon-dark.svg";
import avatarLightSVG from "../../../public/media/raccoon-dark.svg";
import { LoginCard } from "./LoginCard";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { defaultModelSelector } from "../../redux/selectors/modelSelectors";
import { useShowLoginCard } from "./hooks/useShowLoginCard";


interface CheckDivProps {
  title: string;
  checked: boolean;
  onClick: () => void;
}

const StyledDiv = styled.div<{ checked: boolean }>`
    padding: 1rem;
    border-radius: ${defaultBorderRadius};
    border: 1px solid ${vscForeground};
    color: ${vscForeground};
    background-color: ${vscBackground};
    width: 100%;
    box-sizing: border-box;
    margin: 0.5rem 0;
    text-overflow: ellipsis;
`;
const StyledLoginLink = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    background: ${vscListActiveBackground};
    border-radius: 20px 60px 60px 20px;
    line-height: 2;
    padding: 0.5rem;
    box-sizing: border-box;
    cursor: pointer;
`;


const WelcomeMsg = styled.p`
    line-height: 2;
`;

function CheckDiv(props) {
  const { t, i18n } = useTranslation();

  const { title, checked, onClick } = props;

  const config = useSelector(
    (store: RootState) => store.state.config,
  );
  const defaultModel = useSelector(defaultModelSelector);
  const showLoginCard = useShowLoginCard();

  useEffect(() => {
    console.log(window.fullColorTheme, "77");
  }, []);

  var sds = "2323";


  let avator = window.vscMediaUrl ? `${window.vscMediaUrl}/media/raccoon-dark.svg` : avatarDarkSVG;

  let theme = "dark";
  if (window.fullColorTheme) {
    // @ts-ignore
    if (window.fullColorTheme.base === "vs") {
      theme = "light";
      avator = window.vscMediaUrl ? `${window.vscMediaUrl}/media/raccoon-light.svg` : avatarLightSVG;
    }
  }
  let username = 23;
  let robotname = 45;

  return (
    <StyledDiv onClick={onClick} checked={checked}>
      <div className="flex">
        <img style={{ width: "34px", height: "34px" }} src={avator} alt="" />
        <div className="flex flex-col flex-1">
          <p className="m-0 ml-2 mb-0.5 font-bold">
            Raccoon
          </p>
          <span className="m-0 ml-2 text-xs">
            2024/09/26 10:10:39
          </span>
        </div>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </div>
      <div>
        <WelcomeMsg>
          <Trans
            i18nKey="welcome_message"  // 指定翻译键
            values={{ username, robotname }}  // 传递动态变量
            components={{ bold: <b /> }}  // 指定标签替换
          />
        </WelcomeMsg>
      </div>
      <StyledLoginLink onClick={() => showLoginCard.open("Browser")}>
        <User className="pr-2" />
        <Trans
          i18nKey="Login to"  // 指定翻译键
          values={{ robotname }}  // 传递动态变量
          components={{ bold: <b /> }}  // 指定标签替换
        />
        <CaretDoubleRight className="ml-auto mr-2" />
      </StyledLoginLink>
      {
        showLoginCard?.show && <LoginCard />
      }
    </StyledDiv>
  );
}

export default CheckDiv;