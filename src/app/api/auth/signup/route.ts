import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcrypt';

// Define the structure of your users table
interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  created_at: string;
}

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
  }

  try {
    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{ email, password: hashedPassword, name }])
      .select()
      .single();

    if (insertError) throw insertError;

    if (!data) {
      throw new Error('No data returned from insert operation');
    }

    const newUser = data as User;

    return NextResponse.json({ message: 'User created successfully', userId: newUser.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
