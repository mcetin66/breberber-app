export const SUBSCRIPTION_PLANS = [
    {
        id: 'silver',
        label: 'Silver Plan',
        staffLimit: 1,
        color: '#9CA3AF',
        price: 100, // Nominal price for display logic if needed
    },
    {
        id: 'gold',
        label: 'Gold Plan',
        staffLimit: 10,
        color: '#FBBF24',
        price: 200,
    },
    {
        id: 'platinum',
        label: 'Platinum Plan',
        staffLimit: 999, // Unlimited
        color: '#E2E8F0',
        price: 500,
    }
] as const;

export type SubscriptionTier = typeof SUBSCRIPTION_PLANS[number]['id'];

export const getPlanDetails = (tierId: string) => {
    return SUBSCRIPTION_PLANS.find(p => p.id === tierId) || SUBSCRIPTION_PLANS[0];
};
