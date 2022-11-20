import { render, screen, waitFor } from "@testing-library/react";
import LanguageSelect from "../components/Select";
import "@testing-library/jest-dom";

describe("Language", () => {
  test("Should have languages", async() => {
    render(<LanguageSelect />);

    expect(screen.getByText("Language")).toBeInTheDocument();
  });

});
