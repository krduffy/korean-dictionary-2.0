import { SettingNameAndControls } from "./SettingNameAndControls";

export const FontSizeSettingArea = ({
  fontSizeSettings,
}: {
  fontSizeSettings: {
    relativeFontSize: number;
    demoFontSize: number;
    setDemoFontSize: (newSize: number) => void;
  };
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    fontSizeSettings.setDemoFontSize(Number(e.target.value));
  };

  const getSampleSize = () => {
    /* has the relative size scalar applied */
    const before = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-size")
      .replace("em", "");

    /* getting default */
    const defaultSize = Number(before) / fontSizeSettings.relativeFontSize;

    /* reapplying new scalar for demo */
    const ret = defaultSize * 2 ** fontSizeSettings.demoFontSize;

    return isNaN(ret) ? 1 : ret;
  };

  const controlArea = (
    <div>
      <input
        type="range"
        className="w-full"
        min="-1"
        max="1"
        step="0.1"
        value={fontSizeSettings.demoFontSize}
        onChange={handleChange}
        list="labels"
      />
      <datalist id="labels">
        <option value="-1" label="0.5x" />
        <option value="0" label="1x" />
        <option value="1" label="2x" />
      </datalist>
      <div className="w-full flex justify-between">
        <div className="w-4 text-center">0.5x</div>
        <div className="w-4 text-center">1x</div>
        <div className="w-4 text-center">2x</div>
      </div>

      {/* shows size */}
      <div className="min-h-6">
        <div
          className="h-full w-full text-center"
          style={{ fontSize: `${getSampleSize()}em` }}
        >
          글꼴 크기를 변경해보세요!
        </div>
      </div>
    </div>
  );

  return (
    <SettingNameAndControls
      settingName="글꼴 크기"
      settingHelp="글꼴의 크기를 변경한다."
      controls={controlArea}
    />
  );
};
