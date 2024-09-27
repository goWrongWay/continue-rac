import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TabTitle } from "../LoginCardTabs";
import useHistory from "../../../hooks/useHistory";
import { setOnboardingCard, setShowLoginCard } from "../../../redux/slices/uiStateSlice";
import { RootState } from "../../../redux/store";
import { getLocalStorage, setLocalStorage } from "../../../util/localStorage";

export interface ShowLoginCardState {
  show?: boolean;
  activeTab?: TabTitle;
}

export interface UseShowLoginCard {
  show: ShowLoginCardState["show"];
  activeTab: ShowLoginCardState["activeTab"];
  setActiveTab: (tab: TabTitle) => void;
  open: (tab: TabTitle) => void;
  close: () => void;
}

export function useShowLoginCard(): UseShowLoginCard {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { saveSession } = useHistory(dispatch);

  const showLoginCard = useSelector(
    (state: RootState) => state.uiState.showLoginCard,
  );

  const onboardingStatus = getLocalStorage("onboardingStatus");
  const hasDismissedOnboardingCard = getLocalStorage(
    "hasDismissedOnboardingCard",
  );

  let show: boolean;

  // Always show if we explicitly want to, e.g. passing free trial
  // and setting up keys
  if (showLoginCard?.show) {
    show = true;
  } else {
    show = onboardingStatus !== "Completed" && !hasDismissedOnboardingCard;
  }

  function open(tab: TabTitle) {
    navigate("/");

    // Used to clear the chat panel before showing onboarding card
    saveSession();

    // dispatch(setOnboardingCard({ show: true, activeTab: tab }));
    dispatch(setShowLoginCard({ show: true, activeTab: tab }));
  }

  function close() {
    setLocalStorage("hasDismissedOnboardingCard", true);
    dispatch(setShowLoginCard({ show: false }));
  }

  function setActiveTab(tab: TabTitle) {
    dispatch(setShowLoginCard({ show: true, activeTab: tab }));
  }

  return {
    show,
    setActiveTab,
    open,
    close,
    activeTab: showLoginCard?.activeTab,
  };
}
