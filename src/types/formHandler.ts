export interface FieldStyle {
  width?: string;
  height?: string;
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  min?: number;
  max?: number;
  email?: boolean;
  url?: boolean;
}

export type FieldValue = string | number | boolean | Date | null;

export type FormDataRecord = Record<string, FieldValue>;

export interface UploadFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
  content?: ArrayBuffer | string;
}

export interface FormField {
  id: string;
  name?: string;
  type: string;
  label: string;
  style?: FieldStyle;
  options?: SelectOption[];
  required?: boolean;
  validation?: FieldValidation;
  placeholder?: string;
  isSystemField?: boolean;
  showOnlyInPreview?: boolean;
  value?: FieldValue;
}

export interface FormHandler {
  id: number;
  partner_id: number;
  service_id: number;
  brand_id: number;
  service_url: string;
  form_data: FormField[];
  created_at: string;
  updated_at: string;
}
