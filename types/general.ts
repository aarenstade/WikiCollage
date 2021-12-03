export interface SubmissionStatus {
  ready: boolean;
  processing: boolean;
  success: boolean;
  message?: string;
  image?: string;
}

export interface AdditionSubmitFormValues {
  creator: string;
  description?: string;
}
