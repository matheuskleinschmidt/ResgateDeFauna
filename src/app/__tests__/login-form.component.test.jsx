import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

import { LoginForm } from '@/components/login-form';

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, ...props }) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, ...props }) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardContent: ({ children, ...props }) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, ...props }) => (
    <div data-testid="card-description" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, ...props }) => (
    <h1 data-testid="card-title" {...props}>
      {children}
    </h1>
  ),
}));

vi.mock('@/components/ui/input', () => ({
  Input: (props) => (
    <input data-testid="input" {...props} />
  ),
}));

vi.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }) => (
    <label {...props}>{children}</label>
  ),
}));

describe('LoginForm Component', () => {
  let pushMock;

  beforeEach(() => {
    pushMock = vi.fn();
    useRouter.mockReturnValue({ push: pushMock });
    signIn.mockReset();
  });

  it('deve renderizar o componente LoginForm', () => {
    render(<LoginForm />);

    expect(screen.getByTestId('card')).toBeInTheDocument();
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
    expect(screen.getByTestId('card-title')).toHaveTextContent('Login');
    expect(screen.getByTestId('card-description')).toHaveTextContent('Entre com seu email e senha para acessar sua conta');
    expect(screen.getAllByTestId('input')).toHaveLength(2);
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

//TODO: Fix this test

//   it('deve chamar signIn com credenciais ao submeter o formulário', async () => {
//     signIn.mockResolvedValue({ ok: true, error: null });
//     render(<LoginForm />);

//     fireEvent.change(screen.getByPlaceholderText('m@example.com'), { target: { value: 'user@example.com' } });
//     fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

//     fireEvent.submit(screen.getByTestId('login-form'));

//     await waitFor(() => {
//       expect(signIn).toHaveBeenCalledWith('credentials', {
//         redirect: false,
//         email: 'user@example.com',
//         password: 'password123',
//       });
//     });

//     expect(pushMock).toHaveBeenCalledWith('/');
//   });

//   it('deve exibir erro quando signIn falha', async () => {
//     signIn.mockResolvedValue({ ok: false, error: 'Invalid credentials' });
//     render(<LoginForm />);

//     fireEvent.change(screen.getByPlaceholderText('m@example.com'), { target: { value: 'user@example.com' } });
//     fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });

//     fireEvent.submit(screen.getByTestId('login-form'));

//     await waitFor(() => {
//       expect(signIn).toHaveBeenCalledWith('credentials', {
//         redirect: false,
//         email: 'user@example.com',
//         password: 'wrongpassword',
//       });
//     });

//     expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
//     expect(pushMock).not.toHaveBeenCalled();
//   });

  it('deve corresponder ao snapshot', () => {
    const { container } = render(<LoginForm />);
    expect(container).toMatchSnapshot();
  });
});
