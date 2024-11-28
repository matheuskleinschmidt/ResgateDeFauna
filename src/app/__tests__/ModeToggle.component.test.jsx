import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTheme } from "next-themes";

import { ModeToggle } from "@/app/components/ModeToggle";

vi.mock("next-themes", () => ({ useTheme: vi.fn() }));

vi.mock("lucide-react", () => ({
  Sun: (props) => <svg data-testid="sun-icon" {...props} />,
  Moon: (props) => <svg data-testid="moon-icon" {...props} />,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }) => (
    <button data-testid="button" {...props}>
      {" "}
      {children}{" "}
    </button>
  ),
}));

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children }) => (
    <div data-testid="dropdown-menu-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children }) => (
    <div data-testid="dropdown-menu-content">{children}</div>
  ),
  DropdownMenuItem: ({ children, onClick }) => (
    <div data-testid="dropdown-menu-item" onClick={onClick}>
      {" "}
      {children}{" "}
    </div>
  ),
}));

describe("ModeToggle Component", () => {
  let setThemeMock;

  beforeEach(() => {
    setThemeMock = vi.fn();
    useTheme.mockReturnValue({ setTheme: setThemeMock });
  });

  it("deve renderizar o componente ModeToggle", () => {
    render(<ModeToggle />);

    expect(screen.getByTestId("button")).toBeInTheDocument();
    expect(screen.getByTestId("sun-icon")).toBeInTheDocument();
    expect(screen.getByTestId("moon-icon")).toBeInTheDocument();
    expect(screen.getByText("Toggle theme")).toBeInTheDocument();
  });

  it('deve abrir o menu dropdown ao clicar no trigger', () => {
    render(<ModeToggle />);
  
    const trigger = screen.getByTestId('button');
  
    fireEvent.click(trigger);
  
    expect(screen.getByText('Light')).toBeInTheDocument();
    expect(screen.getByText('Dark')).toBeInTheDocument();
    expect(screen.getByText('System')).toBeInTheDocument();
  });
  

  it('deve definir o tema como "light" quando clicar em Light', () => {
    render(<ModeToggle />);

    const trigger = screen.getByTestId("button");
    fireEvent.click(trigger);

    const lightOption = screen.getByText("Light");
    fireEvent.click(lightOption);

    expect(setThemeMock).toHaveBeenCalledWith("light");
  });

  it('deve definir o tema como "dark" quando clicar em Dark', () => {
    render(<ModeToggle />);

    const trigger = screen.getByTestId("button");
    fireEvent.click(trigger);

    const darkOption = screen.getByText("Dark");
    fireEvent.click(darkOption);

    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it('deve definir o tema como "system" quando clicar em System', () => {
    render(<ModeToggle />);

    const trigger = screen.getByTestId("button");
    fireEvent.click(trigger);

    const systemOption = screen.getByText("System");
    fireEvent.click(systemOption);

    expect(setThemeMock).toHaveBeenCalledWith("system");
  });

  it("deve corresponder ao snapshot", () => {
    const { container } = render(<ModeToggle />);
    expect(container).toMatchSnapshot();
  });
});
