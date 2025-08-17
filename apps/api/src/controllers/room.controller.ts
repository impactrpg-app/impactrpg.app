import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { AuthGuard, AuthRequest } from "src/middleware/auth.guard";
import { Room } from "src/db/room";
import mongoose, { Model, mongo } from "mongoose";
import { NetworkModuleType, RoomDto, RoomUpdateDto } from "@impact/shared";
import { StorageService } from "src/services/storage.service";

@Controller()
export class RoomController {
  constructor(
    @InjectModel(Room.name) private readonly roomService: Model<Room>,
    private readonly storageService: StorageService
  ) {}

  @ApiOperation({ summary: "Get all rooms" })
  @ApiOkResponse({ type: [RoomDto] })
  @Get("rooms")
  @UseGuards(AuthGuard)
  async getRooms(@Req() req: AuthRequest): Promise<RoomDto[]> {
    const rooms = await this.roomService.find({
      owner: new mongoose.Types.ObjectId(req.user.id),
    });
    return rooms.map((room) => ({
      id: room._id.toString(),
      name: room.name,
    }));
  }

  @ApiOperation({ summary: "Create a room" })
  @ApiOkResponse({ type: RoomDto })
  @Post("room")
  @UseGuards(AuthGuard)
  async createRoom(@Req() req: AuthRequest): Promise<RoomDto> {
    const room = await this.roomService.create({
      name: "New Room",
      owner: new mongoose.Types.ObjectId(req.user.id),
    });
    return {
      id: room._id.toString(),
      name: room.name,
    };
  }

  @ApiOperation({ summary: "Update a room" })
  @ApiOkResponse({ type: RoomDto })
  @Put("room/:id")
  @UseGuards(AuthGuard)
  async updateRoom(
    @Req() req: AuthRequest,
    @Param("id") id: string,
    @Body() body: RoomUpdateDto
  ): Promise<RoomDto> {
    const room = await this.roomService.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
        owner: new mongoose.Types.ObjectId(req.user.id),
      },
      { name: body.name }
    );
    if (!room) {
      throw new NotFoundException("Room not found");
    }
    return {
      id: id,
      name: body.name,
    };
  }

  @ApiOperation({ summary: "Delete a room" })
  @ApiOkResponse({ type: Boolean })
  @Delete("room/:id")
  @UseGuards(AuthGuard)
  async deleteRoom(
    @Req() req: AuthRequest,
    @Param("id") id: string
  ): Promise<boolean> {
    const room = await this.roomService.findById(id);
    if (!room) {
      throw new NotFoundException("Room not found");
    }
    for (const obj of room.objects) {
      for (const module of obj.modules) {
        if (module.type === NetworkModuleType.ImageRenderer) {
          const imageId = module.image.replace(
            new RegExp("http[s]*://[a-zA-Z0-9\:\.]+/image/"),
            ""
          );
          await this.storageService.delete(decodeURIComponent(imageId));
        }
      }
    }
    await this.roomService.deleteOne({
      _id: new mongoose.Types.ObjectId(id),
      owner: new mongoose.Types.ObjectId(req.user.id),
    });
    return true;
  }
}
