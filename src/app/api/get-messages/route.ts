import UserModel from '@/model/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from '../auth/[...nextauth]/options';
import { User } from 'next-auth';

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user;
  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  try {
    const user = await UserModel.findById(_user._id).exec();
    if (!user) {
      return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }
    return Response.json({ messages: user.messages }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
