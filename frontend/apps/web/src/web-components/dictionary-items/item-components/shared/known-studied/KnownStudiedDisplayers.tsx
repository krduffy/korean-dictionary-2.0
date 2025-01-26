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

export const KoreanHeadwordKnownStudiedTogglers = ({
  pk,
  isKnown,
  isStudied,
}: {
  pk: number;
  isKnown: boolean;
  isStudied: boolean;
}) => {
  return (
    <div className="flex gap-2 h-full">
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="known"
        koreanOrHanja="korean"
        isToggled={isKnown}
      />
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="studied"
        koreanOrHanja="korean"
        isToggled={isStudied}
      />
    </div>
  );
};

export const HanjaCharacterKnownStudiedTogglers = ({
  pk,
  isKnown,
  isStudied,
}: {
  pk: string;
  isKnown: boolean;
  isStudied: boolean;
}) => {
  return (
    <div className="flex gap-2">
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="known"
        koreanOrHanja="hanja"
        isToggled={isKnown}
      />
      <KnownStudiedToggler
        pk={pk}
        knownOrStudied="studied"
        koreanOrHanja="hanja"
        isToggled={isStudied}
      />
    </div>
  );
};
