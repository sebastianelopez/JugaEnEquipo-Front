
import { User } from "../interfaces";
import jugaEnEquipoApi from "./jugaEnEquipoApi";
import { usersMock } from "./mock";


export const getUserByNickname = async (
  nickname: string
): Promise<User | null> => {
  try {
    //const { data } = await jugaEnEquipoApi.post("/user/bynickname", { nickname });
    //const { user } = data;

    return JSON.parse(JSON.stringify(usersMock.users[0]))
  } catch (error) {
    return null;
  }
};

interface UserNickname {
  nickname: string;
}

export const getAllUsersNicknames = async (): Promise<UserNickname[] | null> => { 
  try {
    const { data } = await jugaEnEquipoApi.get("/user/nicknames");
    
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return null;
  } 
};

export const getUsersByTerm = async (term: string): Promise<User[] | null> => {
  term = term.toString().toLowerCase();

  try {
    const { data } = await jugaEnEquipoApi.post("/user/byterm", { term });
    
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return null;
  }   
};

export const getAllUsers = async (): Promise<User[] | null> => {
  try {
    const { data } = await jugaEnEquipoApi.get("/user");
    
    return JSON.parse(JSON.stringify(data))
  } catch (error) {
    return null;
  } 
};


export const checkUserEmailPassword = async (email: string, password: string) => {
  const { data } = await jugaEnEquipoApi.post("/user/validateUser", {
    email,
    password,
  });
  const user = JSON.parse(JSON.stringify(data));
  if (!user) {
    return null;
  }

  const { role, name, _id } = user;

  return {
    id: _id,
    email: email.toLocaleLowerCase(),
    role,
    name,
  };
};
