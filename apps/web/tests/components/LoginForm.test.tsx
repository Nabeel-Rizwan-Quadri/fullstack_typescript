import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components/LoginForm';

const push = jest.fn();
const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

describe('LoginForm', () => {
  it('navigates to /dashboard after successful login', async () => {
    (global.fetch as any) = jest.fn(async () => ({
      ok: true,
      status: 201,
      json: async () => ({
        id: 'u1',
        username: 'testuser',
        email: 'testuser@example.com',
      }),
    }));

    const user = userEvent.setup();

    render(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'a@b.com');
    await user.type(screen.getByLabelText('Password'), 'password1234');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/dashboard'));
  });
});
