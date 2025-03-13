import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../src/app/page';

describe('Home component', () => {
  test("Nav contains an h1 with 'Adventra'", () => {
    render(<Page />);

    // Find the H1 inside the nav
    const navHeading = screen.getByRole('heading', {
      level: 1,
      name: 'Adventra',
    });

    // Check if it exists in the document
    expect(navHeading).toBeInTheDocument();
  });
});
