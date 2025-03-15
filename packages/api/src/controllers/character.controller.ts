import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, Put, Req, UnauthorizedException, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ApiOkResponse, ApiOperation, OmitType } from "@nestjs/swagger";
import { Model } from "mongoose";
import { AuthGuard } from "src/middleware/auth.guard";
import { Character } from "src/schema/character";

export class CharacterDto extends OmitType(Character, ['owner']) {}

@Controller()
export class CharacterController {
    constructor(
        @InjectModel(Character.name) private readonly characterService: Model<Character>
    ) {}

    @ApiOperation({ summary: 'Get all characters' })
    @ApiOkResponse({ type: [CharacterDto] })
    @Get('characters')
    @UseGuards(AuthGuard)
    async Characters(@Req() req: Request): Promise<CharacterDto[]> {
        const userId = req['user']['id'];
        if (!userId) {
            throw new UnauthorizedException();
        }

        const characters = await this.characterService.aggregate([
            {
                $match: {
                    owner: userId
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

        const characterDtos = characters.map(character => {
            const characterDto = new CharacterDto(character);
            delete characterDto['owner'];
            return characterDto;
        });
        return characterDtos;
    }

    @ApiOperation({ summary: 'Get a character' })
    @ApiOkResponse({ type: CharacterDto })
    @Get('character/:id')
    @UseGuards(AuthGuard)
    async Character(@Req() req: Request, @Param('id') id: string): Promise<CharacterDto> {
        const userId = req['user']['id'];
        if (!userId) {
            throw new UnauthorizedException();
        }

        const character = await this.characterService.findOne({
            _id: id,
            owner: userId
        });
        
        if (!character) {
            throw new NotFoundException();
        }

        const characterDto = new CharacterDto(character);
        delete characterDto['owner'];
        return characterDto;
    }

    @ApiOperation({ summary: 'Create a character' })
    @ApiOkResponse({ type: Character })
    @Post('character')
    @UseGuards(AuthGuard)
    async CreateCharacter(@Req() req: Request, @Body() body: CharacterDto) {
        const userId = req['user']['id'];
        if (!userId) {
            throw new UnauthorizedException();
        }

        const character = await this.characterService.create({
            ...body,
            owner: userId
        });

        if (!character) {
            throw new BadRequestException('Failed to create character');
        }

        return character;
    }

    @ApiOperation({ summary: 'Update a character' })
    @ApiOkResponse({ type: Character })
    @Put('character/:id')
    @UseGuards(AuthGuard)
    async UpdateCharacter(
        @Req() req: Request,
        @Param('id') id: string,
        @Body() body: CharacterDto
    ) {
        const userId = req['user']['id'];
        if (!userId) {
            throw new UnauthorizedException();
        }

        const character = await this.characterService.findOneAndUpdate(
            { _id: id, owner: userId },
            { $set: body },
            { new: true }
        );

        if (!character) {
            throw new NotFoundException();
        }

        return character;
    }
}