export interface Event {
  id: string;
  name: string;
  description: string;
  game: string;
  image: string | null;
  type: string;
  date: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface EventsResponse {
  data: Event[];
  metadata: {
    total: number;
    count: number;
  };
}

export interface EventResponse {
  data: Event;
}

