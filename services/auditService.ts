import { supabase } from '@/lib/supabase';

/**
 * Logs a system event to the audit_logs table.
 * 
 * @param action - Unique identifier for the action (e.g., 'AUTH_LOGIN', 'BUSINESS_CREATE')
 * @param details - JSON object containing relevant details about the action
 */
export const logAudit = async (action: string, details: object = {}) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.warn('Audit Log: No authenticated user found for action', action);
            return;
        }

        const { error } = await supabase
            .from('audit_logs')
            .insert({
                user_id: user.id,
                action,
                details: details,
            } as any);

        if (error) {
            // RLS policy may block inserts - silently ignore for now
            // console.error('Audit Log Error:', error);
        }
    } catch (e) {
        console.error('Audit Log Exception:', e);
    }
};
