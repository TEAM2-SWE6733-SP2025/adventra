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