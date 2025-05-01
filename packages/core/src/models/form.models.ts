import { ChangeEventHandler, ReactNode } from "react";
import { Matcher } from "react-day-picker";

export type FormFieldInputType =
  | "checkbox"
  | "select"
  | "color"
  | "date"
  | "datetime"
  | "time"
  | "email"
  | "file"
  | "image"
  | "number"
  | "password"
  | "radio"
  | "range"
  | "tel"
  | "text"
  | "switch"
  | "richEditor"
  | "textarea"
  | "colorPicker"
  | "multi-select"
  | "calendar"
  | "autocomplete"
  | "dropdown";

interface DropdownTypes {
  text: string;
  value: string;
  name?: string;
}
type IconPosition = "left" | "right";

export interface FormFieldModel<Name extends string | symbol = string> {
  input_type: FormFieldInputType;
  name: Name;
  selectedOption?: DropdownTypes;
  label?: string;
  placeholder?: string;
  optionsPosition?: "top" | "bottom";
  loading_text?: string;
  initialMenuOpen?: boolean;
  isFetchingNextPage?: boolean;
  description?: string;
  value?: string | number | any[] | boolean | any;
  options?: SelectOptionModel[];
  multiple?: boolean;
  switchDesc?: string;
  switchHelperText?: string;
  onImageUpload?: (data: File[]) => Promise<{ url: string }>;
  calenderDisabled?: Matcher | Matcher[];
  minDate?: Date | string;
  maxDate?: Date;
  iconPosition?: IconPosition;
  icon?: ReactNode;
  iconPos?: "start" | "end";
  checkboxDescription?: string;
  onEmptyMessageClick?: (value: any) => void;
  type?: "custom" | "default";
  onSelect?: (date?: string | null) => void;

  uploaded_files_title?: string;

  hasImage?: boolean;
  // additional attributes
  disabled?: boolean;
  showValues?: boolean;
  hidden?: boolean;
  isLoading?: boolean;
  required?: boolean;
  variant?: "underline" | "default" | "comment" | "box";
  tagClassName?: string;

  initialFocus?: boolean;

  emptyOptionContent?: ReactNode;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  max?: number;
  maxTime?: string;
  minTime?: string;
  maxSize?: number;
  selectedOptions?: DropdownTypes[];
  columnSize?: number;
  rows?: number;
  acceptedExtensions?: string[];
}

export type SelectOptionModel = {
  value: string;
  text: string;
  label?: string;
  description?: string;
};
