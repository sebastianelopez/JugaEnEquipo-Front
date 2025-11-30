import { Team, User } from "../interfaces";

export const mockSearchResults = {
  users: [
    {
      id: "user1",
      username: "gamer123",
      profileImage: "/images/avatars/avatar1.jpg",
      games: [
        { name: "League of Legends", elo: 1500 },
        { name: "Valorant", elo: 2200 },
      ],
    },
    {
      id: "user2",
      username: "proGamer",
      profileImage: "/images/avatars/avatar2.jpg",
      games: [
        { name: "Counter-Strike", elo: 2300 },
        { name: "Dota 2", elo: 1800 },
      ],
    },
    {
      id: "user3",
      username: "casualPlayer",
      profileImage: "/images/avatars/avatar3.jpg",
      games: [
        { name: "Fortnite", elo: 800 },
        { name: "Apex Legends", elo: 950 },
      ],
    },
    {
      id: "user4",
      username: "midRanker",
      profileImage: "/images/avatars/avatar4.jpg",
      games: [
        { name: "League of Legends", elo: 1200 },
        { name: "Overwatch", elo: 1600 },
      ],
    },
    {
      id: "user5",
      username: "topPlayer",
      profileImage: "/images/avatars/avatar5.jpg",
      games: [
        { name: "Valorant", elo: 2500 },
        { name: "Counter-Strike", elo: 2100 },
      ],
    },
    {
      id: "user6",
      username: "newbieGamer",
      profileImage: "/images/avatars/avatar6.jpg",
      games: [
        { name: "Fortnite", elo: 600 },
        { name: "League of Legends", elo: 900 },
      ],
    },
  ] as User[],

  teams: [
    {
      id: "team1",
      name: "Pro Gamers",
      image: "/images/teams/logo1.jpg",
    },
    {
      id: "team2",
      name: "Casual Squad",
      image: "/images/teams/logo2.jpg",
    },
    {
      id: "team3",
      name: "Competitive Crew",
      image: "/images/teams/logo3.jpg",
    },
    {
      id: "team4",
      name: "Weekend Warriors",
      image: "/images/teams/logo4.jpg",
    },
    {
      id: "team5",
      name: "Elite Squad",
      image: "/images/teams/logo5.jpg",
    },
    {
      id: "team6",
      name: "Newbie Friendly",
      image: "/images/teams/logo6.jpg",
    },
  ] as Team[],
};

