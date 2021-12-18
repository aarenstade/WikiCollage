export interface SubmissionStatus {
  ready: boolean;
  processing: boolean;
  success?: boolean;
  message?: string;
  image?: string;
}

export interface AdditionSubmitFormValues {
  name: string;
  description?: string;
  email?: string;
}
