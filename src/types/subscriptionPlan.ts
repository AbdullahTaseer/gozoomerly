export interface SubscriptionPlan {
  plan_id: number;
  name: string;
  price: number;
  seats_limit: number;
  stripeplanid: string;
  stripepriceid: string;
  global: boolean;
  isambassador: boolean;
  countryid: number | null;
  description: string;
  monthly_fee: number;
  per_user_joining_fee: number;
  per_user_monthly_fee: number;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlanListResponse {
  subscriptionPlanList: SubscriptionPlan[];
}

export interface SubscriptionPlanListVariables {
  global?: boolean;
  isambassador?: boolean;
}

export interface Subscription {
  subscription_id: number;
  user_id: number;
  plan_id: number;
  stripe_subscription_id: string;
  stripeplanid: string;
  stripepriceid: string;
  status: string;
  joining_fee_charged: boolean;
  current_period_start: string;
  current_period_end: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSubscriptionResponse {
  createSubscription: Subscription;
}

export interface CreateSubscriptionVariables {
  userId: number;
  planId: number;
}
