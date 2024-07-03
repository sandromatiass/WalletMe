import prismaClient from '../../prisma';
import { hash } from 'bcryptjs';

interface UserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({name, email, password}: UserRequest){
    //checking if the email was sent
    if(!email){
      throw new Error("Email incorrect!")
    }
    //checking if the email already exists
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: {
        email: email
      }
    });

    if(userAlreadyExists){
      throw new Error("User already exists!")
    };

    //encrypting passwords
    const passwordHash = await hash(password, 8);

    //registering the user
    const user = await prismaClient.user.create({
      data: {
        name: name,
        email: email,
        password: passwordHash,
      },
      select: {
        id:true,
        name: true,
        email:true
      }
    });


    return user;
  }
}

export { CreateUserService }