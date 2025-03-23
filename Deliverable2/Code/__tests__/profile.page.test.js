import React from "react";
import { render, screen } from "@testing-library/react";
import ProfilePage from "../src/app/profile/page";
import "@testing-library/jest-dom";

describe("ProfilePage Component", () => {
  test("renders the loading state initially", () => {
    // Render the ProfilePage component
    render(<ProfilePage />);

    // Check if the "Loading..." message is displayed
    const loadingText = screen.getByText("Loading...");
    expect(loadingText).toBeInTheDocument();
  });
});
