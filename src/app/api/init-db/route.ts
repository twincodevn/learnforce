import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'supabase-schema.sql');
    
    if (!fs.existsSync(schemaPath)) {
      return NextResponse.json(
        { message: "Schema file not found. Please ensure supabase-schema.sql exists in the root directory." },
        { status: 400 }
      );
    }

    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let successCount = 0;
    let errors: string[] = [];

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          const { error } = await supabaseAdmin.rpc('exec_sql', { sql: statement });
          if (error) {
            errors.push(`Error executing statement: ${error.message}`);
          } else {
            successCount++;
          }
        } catch (err: any) {
          errors.push(`Error executing statement: ${err.message}`);
        }
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      message: `Database initialization completed. ${successCount} statements executed successfully.`,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error: any) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      { message: `Database initialization failed: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: "Use POST method to initialize the database",
    instructions: [
      "1. Ensure supabase-schema.sql file exists in the root directory",
      "2. Make sure your SUPABASE_SERVICE_ROLE_KEY environment variable is set",
      "3. Send a POST request to this endpoint to initialize the database"
    ]
  });
}