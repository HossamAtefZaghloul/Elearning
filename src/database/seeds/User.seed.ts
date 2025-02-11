import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';
import * as bcrypt from 'bcrypt';
import { AppDataSource } from '../../config/typeorm.config';
import { User, UserRole } from '../core/user.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('Database connection established');

  const users: Partial<User>[] = [];

  createReadStream('./src/database/seeds/data-csv/fake-users.csv')
    .pipe(
      csvParser({ mapHeaders: ({ header }) => header.trim().toLowerCase() }),
    )
    .on('data', async (row: Record<string, string>) => {
      console.log('Row:', row);
      const hashedPassword = await bcrypt.hash(row.password, 10);
      users.push({
        name: row.name,
        email: row.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      });
    })
    .on('end', async () => {
      console.log('Finished reading CSV. Now inserting users...');
      await insertUsers(users);
    })
    .on('error', (error: unknown) => {
      console.error(
        'CSV Parsing failed:',
        error instanceof Error ? error.message : error,
      );
    });
}

async function insertUsers(users: Partial<User>[]) {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const existingUsers = await userRepository.findBy(
      users.map((u) => ({ email: u.email })),
    );

    const newUsers = users.filter(
      (user) =>
        !existingUsers.some(
          (existingUser) => existingUser.email === user.email,
        ),
    );

    if (newUsers.length === 0) {
      console.log('No new users to insert. Seeding skipped.');
      return;
    }

    await userRepository.insert(newUsers);
    console.log('Seeding complete');
  } catch (error: unknown) {
    console.error(
      'Seeding failed:',
      error instanceof Error ? error.message : error,
    );
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

seed().catch((error: unknown) => {
  console.error(
    'Seeding failed:',
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
