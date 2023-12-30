import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  // Connect to the database
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    // Check if username is already taken by a verified user
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        { success: false, message: 'Username is already taken' },
        { status: 400 }
      );
    }

    // Check if email is already in use
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: 'User already exists with this email' },
          { status: 400 }
        );
      } else {
        // User exists but is not verified, update password and generate new verification code
        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        await existingUserByEmail.save();

        return Response.json(
          {
            success: true,
            message:
              'Password updated and verification code sent. Please verify your account.',
          },
          { status: 200 }
        );
      }
    }

    // Hash the password for new users
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a 6-digit verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    // Create a new user
    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      isVerified: false,
      isAcceptingMessages: true,
      messages: [],
    });

    // Save the new user to the database
    await newUser.save()

    // Send a success response
    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your account.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    // Return an error response if creating a user fails
    return Response.json(
      { success: false, message: 'Error registering user' },
      { status: 500 }
    );
  }
}
