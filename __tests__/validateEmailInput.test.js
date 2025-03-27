import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ValidatedEmailInput from "@/app/components/ValidateEmailInput";

describe("ValidatedEmailInput Component", () => {
  let mockOnChange;

  beforeEach(() => {
    mockOnChange = jest.fn();
  });

  test("validates a correct email address", () => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return (
        <ValidatedEmailInput
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            mockOnChange(newValue);
          }}
        />
      );
    };

    render(<Wrapper />);

    const input = screen.getByPlaceholderText("Email");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    expect(mockOnChange).toHaveBeenCalledWith("test@example.com");
    expect(screen.queryByText("Invalid email address")).not.toBeInTheDocument();
    expect(input).toHaveClass("border-green-500");
  });
});

describe("ValidatedEmailInput Component", () => {
  let mockOnChange;

  beforeEach(() => {
    mockOnChange = jest.fn();
  });

  test("renders the input field with a placeholder", () => {
    render(
      <ValidatedEmailInput
        value=""
        onChange={mockOnChange}
        placeholder="Enter your email"
      />
    );

    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  test("validates a correct email address", () => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return (
        <ValidatedEmailInput
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            mockOnChange(newValue);
          }}
        />
      );
    };

    render(<Wrapper />);

    const input = screen.getByPlaceholderText("Email");
    fireEvent.change(input, { target: { value: "test@example.com" } });

    expect(mockOnChange).toHaveBeenCalledWith("test@example.com");
    expect(screen.queryByText("Invalid email address")).not.toBeInTheDocument();
    expect(input).toHaveClass("border-green-500");
  });

  test("shows an error message for an invalid email address", () => {
    render(<ValidatedEmailInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText("Email");
    fireEvent.change(input, { target: { value: "invalid-email" } });

    expect(mockOnChange).toHaveBeenCalledWith("invalid-email");
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(input).toHaveClass("border-red-500");
  });

  test("updates the input value when typing", () => {
    const Wrapper = () => {
      const [value, setValue] = useState("");
      return (
        <ValidatedEmailInput
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
            mockOnChange(newValue);
          }}
        />
      );
    };

    render(<Wrapper />);

    const input = screen.getByPlaceholderText("Email");
    fireEvent.change(input, { target: { value: "new@example.com" } });

    expect(mockOnChange).toHaveBeenCalledWith("new@example.com");
    expect(input).toHaveValue("new@example.com");
  });

  test("renders the default placeholder when none is provided", () => {
    render(<ValidatedEmailInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText("Email");
    expect(input).toBeInTheDocument();
  });
});
