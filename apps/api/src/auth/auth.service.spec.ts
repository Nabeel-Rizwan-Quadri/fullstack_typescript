import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('hashes and verifies passwords', async () => {
    const authService = new AuthService(
      {} as any,
      { sign: () => 'token' } as any,
      { get: () => '1d' } as any,
    );

    const hash = await authService.hashPassword('correct horse battery staple');
    expect(hash).not.toContain('correct horse battery staple');

    await expect(
      authService.verifyPassword('correct horse battery staple', hash),
    ).resolves.toBe(true);

    await expect(authService.verifyPassword('wrong', hash)).resolves.toBe(false);
  });
});
