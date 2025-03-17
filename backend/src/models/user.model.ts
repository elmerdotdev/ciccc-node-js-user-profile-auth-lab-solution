import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'
import { User } from "../types/user";

class UserModel {
  private users: User[] = []

  findByUsername(username: string) {
    const user = this.users.find(u => u.username === username)
    if (!user) return false
    return user
  }

  async login(username: string, password: string) {
    const user = this.users.find(u => u.username === username)
    if (!user) return false
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return false
    return user
  }

  async create(newUser: Omit<User, 'id'>) {
    const { username, password, firstname, lastname } = newUser
    const foundUser = this.users.find(u => u.username === username)
    if (foundUser) return false
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = {
      id: uuidv4(),
      username,
      password: hashedPassword,
      firstname,
      lastname
    }
    this.users.push(user)
    return user
  }
}

export default new UserModel