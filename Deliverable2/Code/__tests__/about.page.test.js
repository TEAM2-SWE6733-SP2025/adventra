import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AboutPage from "../src/app/about/page";

// Mock the Navbar component
jest.mock("../src/app/components/Navbar.jsx", () => {
  const MockNavbar = () => <nav>Mock Navbar</nav>;
  MockNavbar.displayName = "MockNavbar";
  return MockNavbar;
});

describe("AboutPage", () => {
  it("renders the About Us heading", () => {
    render(<AboutPage />);

    // Query the h1 element with the text "About Us"
    const heading = screen.getByRole("heading", { name: /About Us/i });

    // Assert that the heading is in the document
    expect(heading).toBeInTheDocument();
  });

  it("renders the welcome message", () => {
    render(<AboutPage />);

    // Query the paragraph with the welcome message
    const welcomeMessage = screen.getByText(/Welcome to/i);

    // Assert that the welcome message is in the document
    expect(welcomeMessage).toBeInTheDocument();
  });

  it("renders the mission statement", () => {
    render(<AboutPage />);

    // Query the paragraph with the mission statement
    const missionStatement = screen.getByText(
      /Our mission is to make exploring the world more fun/i,
    );

    // Assert that the mission statement is in the document
    expect(missionStatement).toBeInTheDocument();
  });
});
