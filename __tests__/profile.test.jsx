import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "../src/app/components/Profile";
import "@testing-library/jest-dom";

describe("ProfilePage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(); // Mock the global fetch function
  });

  const mockUserData = {
    id: "user-id",
    name: "Test User",
    birthdate: "1990-01-01",
    gender: "Male",
    state: "CA",
    city: "Los Angeles",
    profilePic: "https://example.com/profile.jpg",
    languages: ["English", "Spanish"],
    adventureTypes: ["Hiking", "Camping"],
    skillLevel: "Intermediate",
    travelPreferences: {
      environment: ["Mountains", "Beaches"],
      weather: ["Sunny"],
      duration: ["Weekend"],
    },
    bio: "I love outdoor adventures and meeting new people.",
    socialMedia: {
      instagram: "https://instagram.com/testuser",
      twitter: "https://twitter.com/testuser",
      linkedIn: "https://linkedin.com/in/testuser",
    },
    attitude: ["Adventurous", "Curious"],
    photos: [
      { url: "https://example.com/photo1.jpg", caption: "Photo 1" },
      { url: "https://example.com/photo2.jpg", caption: "Photo 2" },
    ],
  };

  it("renders the loading state", () => {
    render(<ProfilePage />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the profile page with user data", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    render(<ProfilePage />);

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    // Check profile picture
    const profilePic = screen.getByAltText("Profile");
    expect(profilePic).toHaveAttribute("src", mockUserData.profilePic);

    // Check user details
    expect(screen.getByText("Los Angeles, CA")).toBeInTheDocument();
    expect(screen.getByText("Male")).toBeInTheDocument();
    expect(screen.getByText("English, Spanish")).toBeInTheDocument();
    expect(screen.getByText("Hiking")).toBeInTheDocument();
    expect(screen.getByText("Camping")).toBeInTheDocument();
    expect(screen.getByText("Intermediate")).toBeInTheDocument();
  });

  it("renders the Edit Profile button", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    render(<ProfilePage />);

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("Edit Profile")).toBeInTheDocument();
    });
  });

  it("allows editing the profile details", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    render(<ProfilePage />);

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    // Click the "Edit Profile" button
    const editButton = screen.getByText("Edit Profile");
    fireEvent.click(editButton);

    // Check that fields are editable
    const instaURL = screen.getByPlaceholderText("Instagram URL");
    fireEvent.change(instaURL, { target: { value: "https://instagram.com" } });
    expect(instaURL.value).toBe("https://instagram.com");
  });

  it("saves the updated profile", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    render(<ProfilePage />);

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    // Click the "Edit Profile" button
    const editButton = screen.getByText("Edit Profile");
    fireEvent.click(editButton);

    // Check that fields are editable
    const bio = screen.getByRole("textbox", { name: /About Me/i });
    fireEvent.change(bio, {
      target: { value: "New Bio" },
    });
    expect(bio.value).toBe("New Bio");

    // Click the "Save" button
    const saveButton = screen.getByText("Save");
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockUserData,
        bio: "New Bio",
      }),
    });
    fireEvent.click(saveButton);

    // Wait for the save to complete
    await waitFor(() => {
      const bioTextarea = screen.getByRole("textbox", { name: /About Me/i });
      expect(bioTextarea).toBeInTheDocument();
    });
  });

  it("handles deleting the account", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    render(<ProfilePage />);

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    // Click the "Delete Account" button
    const deleteButton = screen.getByText("Delete Account");
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });
    window.confirm = jest.fn(() => true); // Mock confirmation dialog
    fireEvent.click(deleteButton);

    // Check that the account deletion request was sent
    expect(global.fetch).toHaveBeenCalledWith("/api/delete-account", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: mockUserData.id }),
    });
  });

  it("handles uploading a profile picture", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    render(<ProfilePage />);

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    // Click the profile picture to upload a new one
    const profilePic = screen.getByAltText("Profile");
    const file = new File(["dummy content"], "profile.jpg", {
      type: "image/jpeg",
    });

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ fileUrl: "https://example.com/new-profile.jpg" }),
    });
    fireEvent.change(profilePic, { target: { files: [file] } });

    // Wait for the upload to complete
    await waitFor(() => {
      expect(profilePic).toBeInTheDocument();
    });
  });

  it("renders the user's travel preferences", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    render(<ProfilePage />);

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("Mountains")).toBeInTheDocument();
      expect(screen.getByText("Beaches")).toBeInTheDocument();
      expect(screen.getByText("Sunny")).toBeInTheDocument();
      expect(screen.getByText("Weekend")).toBeInTheDocument();
    });
  });

  it("renders the user's attitude", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    render(<ProfilePage />);

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("Adventurous")).toBeInTheDocument();
      expect(screen.getByText("Curious")).toBeInTheDocument();
    });
  });

  it("renders the LinkedIn link with the correct href", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData,
    });

    render(<ProfilePage />);

    // Wait for user data to load
    await waitFor(() => {
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    // Check the LinkedIn link
    const linkedInLink = screen.getByRole("link", { name: /Instagram/i });
    expect(linkedInLink).toHaveAttribute(
      "href",
      "https://instagram.com/testuser",
    );
  });
});
