/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useTruncatorDropdown } from "../../web-components/ui/useTruncatorDropdown";

describe("useTruncatorDropdown", () => {
  const children = (
    <div>
      <p>하나</p>
      <p>둘</p>
      <p>셋</p>
    </div>
  );

  const maxHeight = 100;

  it("should scroll back to the override ref when collapsing", () => {
    const mockScrollIntoView = jest.fn();

    /* because top === -50 it is out of view and should therefore
       scroll into view on scrollback */
    const overrideScrollbackElement = {
      scrollIntoView: mockScrollIntoView,
      getBoundingClientRect: () => ({
        top: -50,
        bottom: 150,
        left: 0,
        right: 100,
        width: 100,
        height: 100,
      }),
    } as unknown as HTMLElement;

    const { result } = renderHook(() =>
      useTruncatorDropdown({
        children,
        maxHeight,
        droppedDown: true,
        onDropdownStateToggle: () => {},
        overrideScrollbackElement,
      })
    );

    act(() => {
      result.current.handleClickButton();
    });

    expect(mockScrollIntoView).toHaveBeenCalledTimes(1);
  });
});
