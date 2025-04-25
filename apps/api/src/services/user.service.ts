import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { WithUserId, User } from "src/db";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async getUsersById(ids: string[]): Promise<WithUserId<User>[]> {
    const mongodbIds = ids.map((id) => new Types.ObjectId(id));
    const result = await this.userModel.find({ _id: { $in: mongodbIds } });
    return result;
  }
}
