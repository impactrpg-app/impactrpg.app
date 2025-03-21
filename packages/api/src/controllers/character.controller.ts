import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ApiOkResponse, ApiOperation, ApiProperty, OmitType } from "@nestjs/swagger";
import mongoose, { Model } from "mongoose";
import { AuthGuard, AuthRequest } from "src/middleware/auth.guard";
import { Character } from "src/db/character";

export class CharacterDto extends OmitType(Character, ['owner']) {}

export class CharacterListDto {
    @ApiProperty({ type: String })
    id: string;
    @ApiProperty({ type: String })
    name: string;
    @ApiProperty({ type: String, nullable: true })
    image: string;
}

@Controller()
export class CharacterController {
    constructor(
        @InjectModel(Character.name) private readonly characterService: Model<Character>
    ) {}

    @ApiOperation({ summary: 'Get all characters' })
    @ApiOkResponse({ type: [CharacterDto] })
    @Get('characters')
    @UseGuards(AuthGuard)
    async characters(@Req() req: AuthRequest): Promise<CharacterListDto[]> {
        const userId = req.user.id;

        const characters = await this.characterService.aggregate([
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $project: {
                    _id: 1,
                    'info.name': 1,
                    'info.image': 1
                }
            }
        ]);

        const characterDtos = characters.map(character => ({
            id: character._id.toString(),
            name: character['info']['name'],
            image: character['info']['image']
        }));
        return characterDtos;
    }

    @ApiOperation({ summary: 'Get a character' })
    @ApiOkResponse({ type: CharacterDto })
    @Get('character/:id')
    @UseGuards(AuthGuard)
    async character(@Req() req: AuthRequest, @Param('id') id: string): Promise<CharacterDto> {
        const userId = req.user.id;

        const character = await this.characterService.findOne({
            _id: new mongoose.Types.ObjectId(id),
            owner: new mongoose.Types.ObjectId(userId)
        });
        
        if (!character) {
            throw new NotFoundException();
        }

        const characterDto = character as CharacterDto;
        delete characterDto['owner'];
        return characterDto;
    }

    @ApiOperation({ summary: 'Create a character' })
    @ApiOkResponse({ type: CharacterListDto })
    @Post('character')
    @UseGuards(AuthGuard)
    async createCharacter(@Req() req: AuthRequest, @Body() body: CharacterDto) {
        const userId = req.user.id;

        delete body['_id'];
        const character = await this.characterService.create({
            ...body,
            owner: new mongoose.Types.ObjectId(userId)
        });

        if (!character) {
            throw new BadRequestException('Failed to create character');
        }

        return {
            id: character._id.toString(),
            name: character.info.name,
            image: character.info.image
        };
    }

    @ApiOperation({ summary: 'Update a character' })
    @ApiOkResponse({ type: Character })
    @Put('character/:id')
    @UseGuards(AuthGuard)
    async updateCharacter(
        @Req() req: AuthRequest,
        @Param('id') id: string,
        @Body() body: CharacterDto
    ) {
        const userId = req.user.id;

        const character = await this.characterService.findOneAndUpdate(
            { 
                _id: new mongoose.Types.ObjectId(id),
                owner: new mongoose.Types.ObjectId(userId)
            },
            { $set: body },
            { new: true }
        );

        if (!character) {
            throw new NotFoundException();
        }

        return character;
    }

    @ApiOperation({ summary: 'Delete a character' })
    @ApiOkResponse({ type: Boolean })
    @Delete('character/:id')
    @UseGuards(AuthGuard)
    async deleteCharacter(@Req() req: AuthRequest, @Param('id') id: string) {
        const userId = req.user.id;

        const character = await this.characterService.findOneAndDelete({
            _id: new mongoose.Types.ObjectId(id),
            owner: new mongoose.Types.ObjectId(userId)
        });

        if (!character) {
            throw new NotFoundException();
        }

        return true;
    }
}