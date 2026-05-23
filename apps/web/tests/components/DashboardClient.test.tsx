import { render, screen } from '@testing-library/react';
import { DashboardClient } from '@/components/DashboardClient';

const push = jest.fn();
const replace = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, replace }),
}));

describe('DashboardClient', () => {
  it('renders welcome text after /me resolves', async () => {
    (global.fetch as any) = jest.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        id: 'u1',
        username: 'testuser',
        email: 'testuser@example.com',
      }),
    }));

    render(<DashboardClient />);

    expect(await screen.findByText('Welcome testuser')).toBeInTheDocument();
  });
});
