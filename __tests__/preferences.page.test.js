import React from "react";
import { render, screen } from "@testing-library/react";
import PreferencesPage from "../src/app/preferences/page";
import "@testing-library/jest-dom";
import { SessionProvider } from "next-auth/react";

describe("ProfilePage Component", () => {
  const mockSession = {
    user: {
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.png",
    },
    expires: "2025-12-31T23:59:59.999Z",
  };

  test("renders the Preferences Page", () => {
    render(
      <SessionProvider session={mockSession}>
        <PreferencesPage />
      </SessionProvider>,
    );

    const navbarElement = screen.getByRole("navigation");
    expect(navbarElement).toBeInTheDocument();
  });
});

describe("Preferences Page components", () => {
  const mockSession = {
    user: {
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.png",
    },
    expires: "2025-12-31T23:59:59.999Z",
  };

  it("renders the Preferences heading", () => {
    render(
      <SessionProvider session={mockSession}>
        <PreferencesPage />
      </SessionProvider>,
    );

    const heading = screen.getByRole("heading", {
      name: /Preferences/i,
    });

    expect(heading).toBeInTheDocument();
  });
});

describe("Preferences Page gender filter", () => {
  const mockSession = {
    user: {
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.png",
    },
    expires: "2025-12-31T23:59:59.999Z",
  };

  it("renders the Preferences genders filter", () => {
    render(
      <SessionProvider session={mockSession}>
        <PreferencesPage />
      </SessionProvider>,
    );

    const femaleBtn = screen.getByRole("button", {
      name: /Female/i,
    });
    const everyoneBtn = screen.getByRole("button", {
      name: /Everyone/i,
    });

    expect(femaleBtn).toBeInTheDocument();
    expect(everyoneBtn).toBeInTheDocument();
  });
});

describe("Preferences Page distance filter", () => {
  const mockSession = {
    user: {
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.png",
    },
    expires: "2025-12-31T23:59:59.999Z",
  };

  it("renders the Preferences distance filter", () => {
    render(
      <SessionProvider session={mockSession}>
        <PreferencesPage />
      </SessionProvider>,
    );

    const distanceHeading = screen.getByText("Distance:");
    expect(distanceHeading).toBeInTheDocument();

    const sliders = screen.getAllByRole("slider");
    const distanceSlider = sliders.find(
      (slider) => slider.getAttribute("max") === "1000",
    );

    expect(distanceSlider).toBeInTheDocument();
  });
});

describe("Preferences Page age range filter", () => {
  const mockSession = {
    user: {
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.png",
    },
    expires: "2025-12-31T23:59:59.999Z",
  };

  it("renders the Preferences age range filter", () => {
    render(
      <SessionProvider session={mockSession}>
        <PreferencesPage />
      </SessionProvider>,
    );

    const ageRangeHeading = screen.getByText("Age:");
    expect(ageRangeHeading).toBeInTheDocument();

    const rangeSliderContainer = screen.getByTestId("element");
    expect(rangeSliderContainer).toBeInTheDocument();

    const rangeSliderRange = rangeSliderContainer.querySelector(
      ".range-slider__range",
    );
    expect(rangeSliderRange).toBeInTheDocument();
  });
});

describe("Preferences Page submit Buttons", () => {
  const mockSession = {
    user: {
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.png",
    },
    expires: "2025-12-31T23:59:59.999Z",
  };

  it("renders the Preferences submit Buttons", () => {
    render(
      <SessionProvider session={mockSession}>
        <PreferencesPage />
      </SessionProvider>,
    );

    const appleBtn = screen.getByText("Apply");
    expect(appleBtn).toBeInTheDocument();

    const cancelBtn = screen.getByText("Cancel");
    expect(cancelBtn).toBeInTheDocument();
  });
});
