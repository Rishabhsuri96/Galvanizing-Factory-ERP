export interface DropdownOption {
  id: number;
  name: string;
}

export interface ProductionBatchFormProps {
  contractors: DropdownOption[];
  furnaces: DropdownOption[];
}