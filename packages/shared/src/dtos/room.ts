import { ApiProperty, IsString } from "../nestjs-imports";

export class RoomDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class RoomUpdateDto {
  @ApiProperty()
  @IsString()
  name: string;
}

