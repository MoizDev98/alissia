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
  contextura?: string;
  body_analysis?: any;
  analysis_updated_at?: string;
}

export interface SavedPlan {
  id?: number;
  user_id: number;
  plan_data: any; 
  created_at?: string;
}

export interface UserObjective {
  id?: number;
  user_id: number;
  goal_type: 'bajar' | 'mantener' | 'subir';
  target_weight?: number | null;
  pace?: 'lento' | 'moderado' | 'rapido';
  notes?: string | null;
  is_active?: boolean;
}