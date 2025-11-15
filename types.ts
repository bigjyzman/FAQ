
export interface User {
  id: string;
  nickname: string;
  phone: string;
}

export interface Question {
  id: string;
  text: string;
  authorId: string;
  timestamp: number;
  answer?: string;
  deletedByUser: boolean;
}
