import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ApiOkResponse, ApiOperation, ApiProperty } from "@nestjs/swagger";
import { AuthGuard, AuthRequest } from "src/middleware/auth.guard";
import { Room } from "src/db/room";
import mongoose, { Model } from "mongoose";
import { RoomDto, RoomUpdateDto } from "@impact/shared";

@Controller()
export class RoomController {
    constructor(
        @InjectModel(Room.name) private readonly roomService: Model<Room>
    ){}

    @ApiOperation({ summary: 'Get all rooms' })
    @ApiOkResponse({ type: [RoomDto] })
    @Get('rooms')
    @UseGuards(AuthGuard)
    async getRooms(@Req() req: AuthRequest): Promise<RoomDto[]> {
        const rooms = await this.roomService.find({
            owner: new mongoose.Types.ObjectId(req.user.id)
        });
        return rooms.map(room => ({
            id: room._id.toString(),
            name: room.name
        }));
    }

    @ApiOperation({ summary: 'Create a room' })
    @ApiOkResponse({ type: RoomDto })
    @Post('room')
    @UseGuards(AuthGuard)
    async createRoom(@Req() req: AuthRequest): Promise<RoomDto> {
        const room = await this.roomService.create({
            name: 'New Room',
            owner: new mongoose.Types.ObjectId(req.user.id)
        });
        return {
            id: room._id.toString(),
            name: room.name
        };
    }

    @ApiOperation({ summary: 'Update a room' })
    @ApiOkResponse({ type: RoomDto })
    @Put('room/:id')
    @UseGuards(AuthGuard)
    async updateRoom(
        @Req() req: AuthRequest,
        @Param('id') id: string,
        @Body() body: RoomUpdateDto
    ): Promise<RoomDto> {
        const room = await this.roomService.updateOne({
                _id: new mongoose.Types.ObjectId(id),
                owner: new mongoose.Types.ObjectId(req.user.id)
            },
            { name: body.name },
            { new: true }
        );
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        return {
            id: id,
            name: body.name
        };
    }

    @ApiOperation({ summary: 'Delete a room' })
    @ApiOkResponse({ type: Boolean })
    @Delete('room/:id')
    @UseGuards(AuthGuard)
    async deleteRoom(@Req() req: AuthRequest, @Param('id') id: string): Promise<boolean> {
        const room = await this.roomService.findByIdAndDelete(id);
        if (!room) {
            throw new NotFoundException('Room not found');
        }
        return true;
    }
}