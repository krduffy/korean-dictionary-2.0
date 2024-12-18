import { KnownStudiedIcon } from "./KnownStudiedIcon";
import { KnownStudiedToggler } from "./KnownStudiedToggler";

export const FunctionlessKnownStudiedDisplayers = ({
  known,
  studied,
}: {
  known: boolean;
  studied: boolean;
}) => {
  return (
    <div className="flex gap-2 h-full">
      <KnownStudiedIcon
        loading={false}
        knownOrStudied="known"
        isToggled={known}
      />
      <KnownStudiedIcon
        loading={false}
        knownOrStudied="studied"
        isToggled={studied}
      />
    </div>
  );
};

export const KoreanWordKnownStudiedTogglers = ({
  pk,
  initiallyKnown,
  initiallyStudied,
}: {
  pk: number;
  initiallyKnown: boolean;
  initiallyStudied: boolean;
}) => {
  return (
    <div className="flex gap-2 h-full">
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="known"
        koreanOrHanja="korean"
        initiallyToggled={initiallyKnown}
      />
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="studied"
        koreanOrHanja="korean"
        initiallyToggled={initiallyStudied}
      />
    </div>
  );
};

export const HanjaCharacterKnownStudiedTogglers = ({
  pk,
  initiallyKnown,
  initiallyStudied,
}: {
  pk: string;
  initiallyKnown: boolean;
  initiallyStudied: boolean;
}) => {
  return (
    <div className="flex gap-2">
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="known"
        koreanOrHanja="hanja"
        initiallyToggled={initiallyKnown}
      />
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="studied"
        koreanOrHanja="hanja"
        initiallyToggled={initiallyStudied}
      />
    </div>
  );
};
