import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const db = getDb();
    const client = await db.connect();

    try {
      // Find user by email
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];

      if (!user) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      // Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          is_admin: user.is_admin,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
      );

      // Return token and user info (without password)
      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({ user: userWithoutPassword, token });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
