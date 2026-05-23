import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupForm } from '@/components/SignupForm';

const push = jest.fn();
const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

describe('SignupForm', () => {
  it('navigates to /dashboard after successful signup', async () => {
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

    render(<SignupForm />);

    await user.type(screen.getByLabelText('Username'), 'alice');
    await user.type(screen.getByLabelText('Email'), 'alice@example.com');
    await user.type(screen.getByLabelText('Password'), 'password1234');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/dashboard'));
  });
});
