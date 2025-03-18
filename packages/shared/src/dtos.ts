import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class RoomDto {
    @ApiProperty({
        description: 'The id of the room',
        example: '123'
    })
    @IsString()
    id: string;

    @ApiProperty({
        description: 'The name of the room',
        example: 'My Room'
    })
    @IsString()
    name: string;
}

export class RoomUpdateDto {
    @ApiProperty({
        description: 'The name of the room',
        example: 'My Room'
    })
    @IsString()
    name: string;
}