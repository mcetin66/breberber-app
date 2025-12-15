
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdate() {
    // 1. Get a staff member
    const { data: staffList, error: fetchError } = await supabase
        .from('business_staff')
        .select('*')
        .limit(1);

    if (fetchError || !staffList || staffList.length === 0) {
        console.error('Fetch Failed:', fetchError);
        return;
    }

    const staff = staffList[0];
    console.log('Original Staff:', staff);

    // 2. Try to update name
    const newName = staff.name + ' (Updated)';
    console.log(`Attempting to update name to: "${newName}" for ID: ${staff.id}`);

    const { data: updatedData, error: updateError } = await supabase
        .from('business_staff')
        .update({ name: newName })
        .eq('id', staff.id)
        .select()
        .single();

    if (updateError) {
        console.error('Update Failed:', updateError);
        console.log('Update Error Details:', JSON.stringify(updateError, null, 2));
    } else {
        console.log('Update Success:', updatedData);
    }
}

testUpdate();
