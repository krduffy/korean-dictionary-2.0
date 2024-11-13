/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useFontSizeSettings } from "../useFontSizeSettings";

/* mocking storage api */
beforeEach(() => {
  Storage.prototype.getItem = jest.fn();
  Storage.prototype.setItem = jest.fn();
  Storage.prototype.removeItem = jest.fn();
});

const mockGetComputedStyle = (fontSize: string) => {
  global.getComputedStyle = jest.fn().mockImplementation(() => ({
    getPropertyValue: (property: string) => {
      if (property === "--font-size") {
        return fontSize;
      }
      return "";
    },
  }));
};

describe("useFontSizeSettings", () => {
  it("should return default font size of 1.0 if no preferred font size in localStorage", () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useFontSizeSettings());

    expect(result.current.relativeFontSize).toBeCloseTo(1.0);
  });

  it("should use preferred font size from localStorage", () => {
    // Simulate localStorage returning a saved font size of 1.5
    (localStorage.getItem as jest.Mock).mockReturnValue("1.5");

    const { result } = renderHook(() => useFontSizeSettings());

    expect(result.current.relativeFontSize).toBeCloseTo(1.5);
  });

  it("should update the relative font size in localStorage when updateRelativeFontSize is called", () => {
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    const { result } = renderHook(() => useFontSizeSettings());

    expect(result.current.relativeFontSize).toBeCloseTo(1.0);

    act(() => {
      result.current.updateRelativeFontSize(1.2);
    });

    expect(result.current.relativeFontSize).toBeCloseTo(1.2);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "preferred-relative-font-size",
      "1.2"
    );
  });

  it("should handle errors when updating font size in localStorage", () => {
    (localStorage.setItem as jest.Mock).mockImplementation(() => {
      throw new Error("error");
    });

    const { result } = renderHook(() => useFontSizeSettings());

    let success = undefined;

    act(() => {
      success = result.current.updateRelativeFontSize(1.5);
    });

    expect(success).toBe(false);
  });

  it("should return the correct real font size based on computed --font-size", () => {
    mockGetComputedStyle("16px");

    (localStorage.getItem as jest.Mock).mockReturnValue("1.5");

    const { result } = renderHook(() => useFontSizeSettings());

    /* should be 16 * 1.5 */
    expect(result.current.realFontSize).toBeCloseTo(24);
  });

  it("should handle errors when accessing localStorage", () => {
    (localStorage.getItem as jest.Mock).mockImplementation(() => {
      throw new Error("error");
    });

    const { result } = renderHook(() => useFontSizeSettings());

    expect(result.current.relativeFontSize).toBeCloseTo(1.0);
  });
});
