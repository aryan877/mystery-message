import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function GET(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      // No username provided in the query
      return Response.json(
        { success: false, message: 'Username query parameter is required' },
        { status: 400 }
      );
    }

    // Check if the username already exists in the database among verified users
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      // Username is already taken by a verified user
      return Response.json(
        { success: false, message: 'Username is already taken' },
        { status: 200 }
      );
    }

    // Username is unique among verified users
    return Response.json(
      { success: true, message: 'Username is unique' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    // Return an error response if there is a server error
    return Response.json(
      { success: false, message: 'Error checking username' },
      { status: 500 }
    );
  }
}
