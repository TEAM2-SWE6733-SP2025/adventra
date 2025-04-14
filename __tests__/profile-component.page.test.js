import { render, screen } from "@testing-library/react";
import ProfilePage from "../src/app/profile/page";
import "@testing-library/jest-dom";

jest.mock("../src/app/components/Navbar", () => {
  const Navbar = () => <div data-testid="navbar">Navbar</div>;
  Navbar.displayName = "Navbar"; // Set display name
  return Navbar;
});

jest.mock("../src/app/components/Profile", () => {
  const Profile = () => <div data-testid="profile">Profile</div>;
  Profile.displayName = "Profile"; // Set display name
  return Profile;
});

describe("ProfilePage", () => {
  it("renders the Navbar and Profile components", () => {
    render(<ProfilePage />);

    // Check if Navbar is rendered
    const navbar = screen.getByTestId("navbar");
    expect(navbar).toBeInTheDocument();

    // Check if Profile is rendered
    const profile = screen.getByTestId("profile");
    expect(profile).toBeInTheDocument();
  });

  it("matches the snapshot", () => {
    const { asFragment } = render(<ProfilePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});
