import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Home from "../src/app/page";
import { SessionProvider } from "next-auth/react";

describe("Home component", () => {
  test("renders the main heading", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
      expires: "2025-12-31T23:59:59.999Z",
    };

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>,
    );

    const mainHeading = screen.getByRole("heading", {
      level: 1,
      name: /Meet Adventurers, Explore Together/i,
    });

    expect(mainHeading).toBeInTheDocument();
  });

  test("renders adventure names", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
      expires: "2025-12-31T23:59:59.999Z",
    };

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>,
    );

    const adventureName = screen.getByRole("heading", {
      level: 2,
      name: /Scuba Diving/i,
    });

    expect(adventureName).toBeInTheDocument();
  });

  test("renders adventure locations", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
      expires: "2025-12-31T23:59:59.999Z",
    };

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>,
    );

    const adventureLocation = screen.getByText(/Redang Island, Malaysia/i);

    expect(adventureLocation).toBeInTheDocument();
  });
});

describe("Home component", () => {
  test("renders the main heading", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
      expires: "2025-12-31T23:59:59.999Z",
    };

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>,
    );

    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: /Safari/i,
    });

    expect(mainHeading).toBeInTheDocument();
  });
});

describe("Home component", () => {
  test("renders the main heading", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
      expires: "2025-12-31T23:59:59.999Z",
    };

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>,
    );

    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: /Scuba Diving/i,
    });

    expect(mainHeading).toBeInTheDocument();
  });
});

describe("Home component", () => {
  test("renders the main heading", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
      expires: "2025-12-31T23:59:59.999Z",
    };

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>,
    );

    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: /Mountain Biking/i,
    });

    expect(mainHeading).toBeInTheDocument();
  });
});
describe("Home component", () => {
  test("renders the main heading", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
      expires: "2025-12-31T23:59:59.999Z",
    };

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>,
    );

    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: /favicon/i,
    });

    expect(mainHeading).toBeInTheDocument();
  });
});
describe("Home component", () => {
  test("renders the main heading", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
      expires: "2025-12-31T23:59:59.999Z",
    };

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>,
    );

    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: /profilepic/i,
    });

    expect(mainHeading).toBeInTheDocument();
  });
});
describe("Home component", () => {
  test("renders the main heading", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
      expires: "2025-12-31T23:59:59.999Z",
    };

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>,
    );

    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: /Hiking/i,
    });

    expect(mainHeading).toBeInTheDocument();
  });
});
describe("Home component", () => {
  test("renders the main heading", () => {
    const mockSession = {
      user: {
        name: "Test User",
        email: "test@example.com",
        image: "https://example.com/avatar.png",
      },
      expires: "2025-12-31T23:59:59.999Z",
    };

    render(
      <SessionProvider session={mockSession}>
        <Home />
      </SessionProvider>,
    );

    const mainHeading = screen.getByRole("heading", {
      level: 2,
      name: /safari/i,
    });

    expect(mainHeading).toBeInTheDocument();
  });
});
