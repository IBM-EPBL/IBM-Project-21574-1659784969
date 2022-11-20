import { render, screen, waitFor } from "@testing-library/react";
import BottomNav from "../components/bottomNav";
import "@testing-library/jest-dom";
jest.mock('next/router', () => ({
    useRouter() {
      return ({
        route: '/',
        pathname: '',
        query: '',
        asPath: '',
        push: jest.fn(),
        events: {
          on: jest.fn(),
          off: jest.fn()
        },
        beforePopState: jest.fn(() => null),
        prefetch: jest.fn(() => null)
      });
    },
  }));


describe("Nav", () => {
  test("Should have home route", async() => {
    render(<BottomNav />);

    expect(screen.getByText("Home")).toBeInTheDocument();
  });
    test("Should have Bookmark route", async() => {
    render(<BottomNav />);

    expect(screen.getByText("Bookmarks")).toBeInTheDocument();
  });
    test("Should have topic route", async() => {
    render(<BottomNav />);

    expect(screen.getByText("Topic")).toBeInTheDocument();
  });

});
