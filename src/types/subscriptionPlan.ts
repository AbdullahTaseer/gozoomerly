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

