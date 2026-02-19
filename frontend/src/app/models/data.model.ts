export interface PatientProfile {
  id?: number;
  user_id: number;
  weight: number;
  height: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
  status?: string;
}

export interface SavedPlan {
  id?: number;
  user_id: number;
  plan_data: any; 
  created_at?: string;
}