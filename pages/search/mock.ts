import { Team, User } from "../../interfaces";

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
      profileImage: "/images/teams/logo1.jpg",
      users: [],
    },
    {
      id: "team2",
      name: "Casual Squad",
      profileImage: "/images/teams/logo2.jpg",
      users: [],
    },
    {
      id: "team3",
      name: "Competitive Crew",
      profileImage: "/images/teams/logo3.jpg",
      users: [],
    },
    {
      id: "team4",
      name: "Weekend Warriors",
      profileImage: "/images/teams/logo4.jpg",
      users: [],
    },
    {
      id: "team5",
      name: "Elite Squad",
      profileImage: "/images/teams/logo5.jpg",
      users: [],
    },
    {
      id: "team6",
      name: "Newbie Friendly",
      profileImage: "/images/teams/logo6.jpg",
      users: [],
    },
  ] as Team[],
};
