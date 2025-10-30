export interface IUserResponse {
    user: UserType
}

type UserType = {
    name: string
    email: string
    image: string;
    token?: string
  
}