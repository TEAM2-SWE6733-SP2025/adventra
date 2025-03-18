import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";

describe("Home component", () => {
  test("renders the main heading", () => {
    render(<Home />);

    // Find the main heading
    const mainHeading = screen.getByRole("heading", {
      level: 1,
      name: /Meet Adventurers, Explore Together/i,
    });

    // Check if the heading is in the document
    expect(mainHeading).toBeInTheDocument();
  });
});
