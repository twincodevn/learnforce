import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, username, avatar } = await request.json();
    const userId = session.user.id;

    // Check if username is already taken (if username is being updated)
    if (username) {
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('username', username)
        .neq('id', userId)
        .single();

      if (existingUser) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    // Update user profile
    const updateData: any = {};
    if (name) updateData.full_name = name;
    if (username) updateData.username = username;
    if (avatar) updateData.avatar_url = avatar;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        image: user.avatar_url,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
