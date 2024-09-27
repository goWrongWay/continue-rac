import { useSubmitOnboarding } from "../hooks";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { setDefaultModel } from "../../../redux/slices/stateSlice";
import { Button } from "../../index";
import { useSelector } from "react-redux";
import { defaultModelSelector } from "../../../redux/selectors/modelSelectors";
import { useTranslation } from "react-i18next";

function BrowserLogin() {
  // const { submitOnboarding } = useSubmitOnboarding("Best");
  const defaultModel = useSelector(defaultModelSelector);
  let url = encodeURI(`${defaultModel?.apiBase}login?appname=Raccoon&redirect=vscode://sensetime.raccoon/login`).toString();

  const { t } = useTranslation();

  return (
    <div className="flex flex-col">
      <div className="w-full flex flex-col items-center">
        <ArrowsClockwise className="m-4" size={80} weight="light" />
        <a className="w-full flex justify-center" href={url}>
          <Button
            onClick={() => {
              // submitOnboarding();

              // Set the selected model to the local chat model
              // dispatch(
              //   setDefaultModel({
              //     title: LOCAL_ONBOARDING_CHAT_TITLE,
              //     force: true, // Because it doesn't exist in the webview's config object yet
              //   }),
              // );
            }}
            className="w-3/4"
            // disabled={!hasDownloadedChatModel}
          >
            {t('Login')}
          </Button>
        </a>

      </div>
    </div>
  );
}

export default BrowserLogin;
