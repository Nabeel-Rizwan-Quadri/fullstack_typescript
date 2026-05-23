import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';

describe('UsersService', () => {
  it('throws 409 when username/email already exists', async () => {
    const usersRepository = {
      findOne: jest.fn(async () => ({ id: 'u1' })),
      create: jest.fn(),
      save: jest.fn(),
    };

    const service = new UsersService(usersRepository as any);

    await expect(
      service.create({
        username: 'alice',
        email: 'alice@example.com',
        passwordHash: 'hash',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
