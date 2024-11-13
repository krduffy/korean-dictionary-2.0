/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useTruncatorDropdown } from "../useTruncatorDropdown";

describe("useTruncatorDropdown", () => {
  const children = (
    <div>
      <p>하나</p>
      <p>둘</p>
      <p>셋</p>
    </div>
  );

  const maxHeight = 100;

  it("should initialize with the correct state", () => {
    const { result } = renderHook(() =>
      useTruncatorDropdown({
        children,
        maxHeight,
        initialDropdownState: false,
        onDropdownStateToggle: jest.fn(),
      })
    );

    /* Ensure dropdown is collapsed initially */
    expect(result.current.isExpanded).toBe(false);
    expect(result.current.showButton).toBe(false);
  });

  it("should toggle isExpanded state when button is clicked", () => {
    const { result } = renderHook(() =>
      useTruncatorDropdown({
        children,
        maxHeight,
        initialDropdownState: false,
        onDropdownStateToggle: jest.fn(),
      })
    );

    act(() => {
      result.current.handleClickButton();
    });
    expect(result.current.isExpanded).toBe(true);

    act(() => {
      result.current.handleClickButton();
    });
    expect(result.current.isExpanded).toBe(false);
  });

  it("should call onCollapse when collapsing the dropdown", () => {
    const onCollapseMock = jest.fn();
    /* mocking the ref for overriding scrollback */
    const scrollbackElement = {
      /* -10 for offscreen */
      getBoundingClientRect: jest.fn(() => ({ top: -10 })),
      scrollIntoView: onCollapseMock,
    } as unknown as HTMLElement;

    const { result } = renderHook(() =>
      useTruncatorDropdown({
        children,
        maxHeight,
        initialDropdownState: true,
        onDropdownStateToggle: jest.fn(),
        overrideScrollbackElement: scrollbackElement,
      })
    );

    // Collapse the dropdown
    act(() => {
      result.current.handleClickButton();
    });

    // Check if onCollapse was called
    expect(onCollapseMock).toHaveBeenCalled();
  });

  it("should call onDropdownStateToggle when state changes", () => {
    const onDropdownStateToggleMock = jest.fn();

    const { result } = renderHook(() =>
      useTruncatorDropdown({
        children,
        maxHeight,
        initialDropdownState: false,
        onDropdownStateToggle: onDropdownStateToggleMock,
      })
    );

    act(() => {
      result.current.handleClickButton();
    });

    expect(onDropdownStateToggleMock).toHaveBeenCalledWith(true);

    act(() => {
      result.current.handleClickButton();
    });

    expect(onDropdownStateToggleMock).toHaveBeenCalledWith(false);
  });

  it("should handle overriding scrollbackRef and scrolling into view correctly", () => {
    const mockScrollIntoView = jest.fn();
    const scrollbackElement = {
      /* -10 for offscreen */
      getBoundingClientRect: jest.fn(() => ({ top: -10 })),
      scrollIntoView: mockScrollIntoView,
    } as unknown as HTMLElement;

    const { result } = renderHook(() =>
      useTruncatorDropdown({
        children,
        maxHeight,
        initialDropdownState: true,
        overrideScrollbackElement: scrollbackElement,
        onDropdownStateToggle: jest.fn(),
      })
    );

    act(() => {
      result.current.handleClickButton();
    });

    expect(mockScrollIntoView).toHaveBeenCalled();
  });
});
