export interface MessagesCommentary {
  id?: number;
  commentary: string;
  eventName?: string;
  description: string;
  sportName: string;
  active: boolean;
}

export interface CreateCommentaryResponse {
  commentary: string;
  description: string;
  sportName: string;
  active: boolean;
}

export interface UpdateCommentary {
  description: string;
  active: boolean;
  id: number;
}
