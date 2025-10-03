import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { connect } from '@/dbConnection/dbConnection';
import User from '@/models/userModel';
import DashboardClient from './dashboardClient';

interface IUser {
  username: string;
  isAdmin: boolean;
}

export default async function DashboardPage() {
  await connect();

  try {
    const cookieStore = cookies(); // ✅ this is NOT async
    const tokenCookie = (await cookieStore).get('token'); // ✅ .get() should work here

    if (!tokenCookie) {
      redirect('/login');
    }

    const fakeRequest = {
      cookies: {
        get: (name: string) => {
          if (name === 'token') {
            return { value: tokenCookie.value };
          }
          return undefined;
        },
      },
    } as any;

    const userId = getDataFromToken(fakeRequest);
    if (!userId) {
      redirect('/login');
    }

    const user = await User.findById(userId).lean<IUser>();
    if (!user || !user.isAdmin) {
      redirect('/login');
    }

    return <DashboardClient userName={user.username} />;
  } catch (error) {
    console.error('Auth error:', error);
    redirect('/login');
  }
}
