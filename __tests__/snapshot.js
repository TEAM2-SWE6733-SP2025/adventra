import { render } from "@testing-library/react";
import Page from "../src/app/page";
import { SessionProvider } from "next-auth/react";

it("renders homepage unchanged", () => {
  const mockSession = {
    user: {
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.png",
    },
    expires: "2025-12-31T23:59:59.999Z",
  };

  const { container } = render(
    <SessionProvider session={mockSession}>
      <Page />
    </SessionProvider>,
  );

  expect(container).toMatchSnapshot();
});
