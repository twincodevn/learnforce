import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    // Check environment variables first
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing environment variables",
          message: "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set",
          checklist: [
            "✅ Create .env.local file",
            "✅ Add NEXT_PUBLIC_SUPABASE_URL",
            "✅ Add SUPABASE_SERVICE_ROLE_KEY",
            "❌ Restart development server"
          ]
        },
        { status: 500 }
      );
    }

    // Test basic connection
    const { data: healthCheck, error: healthError } = await supabaseAdmin
      .from('_supabase_info')
      .select('*')
      .limit(1);

    // If basic connection fails, try a simpler test
    if (healthError) {
      // Test if users table exists
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('count')
        .limit(1);

      if (error) {
        return NextResponse.json(
          { 
            success: false, 
            error: error.message,
            message: "Database schema not initialized",
            setup_required: true,
            instructions: [
              "1. Go to your Supabase dashboard SQL Editor",
              "2. Copy and paste the contents of supabase-schema.sql",
              "3. Click 'Run' to execute the schema",
              "4. Alternatively, use POST /api/init-db to initialize automatically"
            ],
            supabase_url: supabaseUrl
          },
          { status: 500 }
        );
      }
    }

    // Test successful - check table count
    const { count } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      success: true,
      message: "Supabase connection successful!",
      database_info: {
        url: supabaseUrl,
        users_count: count || 0,
        status: "Connected"
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        message: "Failed to connect to Supabase"
      },
      { status: 500 }
    );
  }
}
