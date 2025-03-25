import React from "react";
import { render, screen } from "@testing-library/react";
import ProfilePage from "../src/app/profile/page";
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

  test("renders text on the page", () => {
    render(
      <SessionProvider session={mockSession}>
        <ProfilePage />
      </SessionProvider>,
    );

    const mainHeading = screen.getByText(/About Me/i);
    expect(mainHeading).toBeInTheDocument();
  });
});
