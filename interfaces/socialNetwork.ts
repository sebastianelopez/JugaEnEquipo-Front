export interface SocialNetwork {
  id: string;
  name: string;
  code: string;
  url: string;
}

export interface UserSocialNetwork {
  id: string;
  name: string;
  code: string;
  url: string;
  username: string;
  fullUrl?: string;
  // Legacy fields for backward compatibility
  socialNetworkId?: string;
  socialNetwork?: SocialNetwork;
  userId?: string;
}

