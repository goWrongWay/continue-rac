import { useSubmitOnboarding } from "../hooks";

function OnboardingBestTab() {
  const { submitOnboarding } = useSubmitOnboarding("Best");

  return (
    <div className="flex flex-col gap-8">
      <div className="hidden xs:flex w-full">
        2323
      </div>
    </div>
  );
}

export default OnboardingBestTab;
