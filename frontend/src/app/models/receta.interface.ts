export interface Receta {
  id: number;
  nombre: string;
  descripcion: string;
  alimentos: string[];
  caloriasTotales: number;
  estado: number; // 0 = Pendiente | 1 = Aprobada
}
