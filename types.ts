export enum AccountStatus {
  Active = 'Active',
  Checkpoint = 'Checkpoint',
  Locked = 'Locked',
  Disabled = 'Disabled',
}

export enum FriendSuggestionStatus {
  All = 'All',
  Yes = 'Yes',
  No = 'No',
}

export interface Account {
  id: string;
  username: string;
  email: string;
  fbUid: string;
  password: string;
  twoFASecret: string;
  cookies: string;
  status: AccountStatus;
  friendCount: number;
  hasFriendSuggestions: boolean;
  createdDate: string; // ISO Date string
  lastUpdated: string; // ISO Date string
  notes: string;
}

export interface FilterState {
  searchQuery: string;
  status: AccountStatus | 'All';
  friendSuggestion: FriendSuggestionStatus;
  creationYear: string; // '<2024', '2023-2024', '>2024', 'All'
  sortBy: 'friendsDesc' | 'lastUpdateAsc' | 'createdDesc';
}

export type SortOption = 'friendsDesc' | 'lastUpdateAsc' | 'createdDesc';
