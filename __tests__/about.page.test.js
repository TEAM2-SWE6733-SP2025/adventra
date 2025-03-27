import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import AboutPage from "../src/app/about/page";

jest.mock("../src/app/components/Navbar.jsx", () => {
  const MockNavbar = () => <nav>Mock Navbar</nav>;
  MockNavbar.displayName = "MockNavbar";
  return MockNavbar;
});

describe("AboutPage", () => {
  it("renders the About Us heading", () => {
    render(<AboutPage />);

    const heading = screen.getByRole("heading", {
      name: /Welcome to Adventra!/i,
    });

    expect(heading).toBeInTheDocument();
  });

  it("renders the welcome message", () => {
    render(<AboutPage />);

    const welcomeMessage = screen.getByText(/At Adventra/i);

    expect(welcomeMessage).toBeInTheDocument();
  });

  it("renders the mission statement", () => {
    render(<AboutPage />);

    const missionStatement = screen.getByText(
      /our platform connects like-minded adventurers/i
    );

    expect(missionStatement).toBeInTheDocument();
  });
});
