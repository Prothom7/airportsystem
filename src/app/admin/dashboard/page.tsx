import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import { connect } from '@/dbConnection/dbConnection';
import User from '@/models/userModel';
import { getAllFlights, FlightType } from '@/services/flightService';
import DashboardClient from './dashboardClient';

interface IUser {
  _id: string;
  username: string;
  isAdmin: boolean;
}

export default async function DashboardPage() {
  await connect();

  const tokenCookie = (await cookies()).get('token');
  if (!tokenCookie) redirect('/login');

  const fakeRequest = {
    cookies: {
      get: (name: string) => (name === 'token' ? { value: tokenCookie.value } : undefined),
    },
  } as any;

  const userId = getDataFromToken(fakeRequest);
  if (!userId) redirect('/login');

  const user = await User.findById(userId).lean<IUser>();
  if (!user?.isAdmin) redirect('/login');

  const flights: FlightType[] = await getAllFlights();

  return <DashboardClient userName={user.username} flights={flights} />;
}
