
import { supabase } from './lib/supabase';

async function checkSchema() {
    console.log('Fetching one business to check schema...');
    const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .limit(1)
        .single();

    if (error) {
        console.error('Error fetching business:', error);
        return;
    }

    if (data) {
        console.log('Business Record Keys (DB Columns):');
        console.log(Object.keys(data).join(', '));
        console.log('Full Record:', JSON.stringify(data, null, 2));
    } else {
        console.log('No businesses found to check schema.');
    }
}

checkSchema();
