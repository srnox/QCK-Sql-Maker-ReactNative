export interface Vehicle {
    id: string;
    name: string;     // Label for the vehicle (display name)
    model: string;    // Spawn name (internal model name)
    price: number;    // Price of the vehicle
    category: string; // Category of the vehicle (muscle, sport, etc.)
  }
  
  export interface CategoryOption {
    label: string;
    value: string;
  }
  
  export const CATEGORIES: CategoryOption[] = [
    { label: 'Muscle', value: 'muscle' },
    { label: 'Sports', value: 'sports' },
    { label: 'Super', value: 'super' },
    { label: 'Sedan', value: 'sedan' },
    { label: 'Coupe', value: 'coupe' },
    { label: 'Compact', value: 'compact' },
    { label: 'SUV', value: 'suv' },
    { label: 'Offroad', value: 'offroad' },
    { label: 'Motorcycle', value: 'motorcycle' },
    { label: 'Van', value: 'van' },
    { label: 'Truck', value: 'truck' },
  ];