import { render, screen, waitFor } from "@testing-library/react";
import Header from "../components/header";
import "@testing-library/jest-dom";
import {useSession} from "next-auth/react";

jest.mock("next-auth/react", () => {
  const originalModule = jest.requireActual('next-auth/react');
  const mockSession = {
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
    user: { username: "admin" }
  };
  return {
    __esModule: true,
    ...originalModule,
    useSession: jest.fn(() => {
      return {data: mockSession, status: 'authenticated'}
    }),
  };
});

describe("Home", () => {
  test("Should have a header", async() => {
    render(<Header />);

    expect(screen.getByText("News app")).toBeInTheDocument();
  });

  test("Should have logout button", async() => {
    render(<Header />);

    expect(screen.getByText("Logout")).toBeInTheDocument();
  })
   test("Should have bookmark button", async() => {
    render(<Header />);

    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
  })
  
});
