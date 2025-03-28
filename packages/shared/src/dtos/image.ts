import { ApiProperty, IsString } from "../nestjs-imports";

export class ImageUploadResponse {
  @ApiProperty({
    description: "The path of the uploaded image",
  })
  @IsString()
  path: string;
}

export class ImageListResponse {
  @ApiProperty({
    description: "The path to the image",
  })
  path: string;

  @ApiProperty({
    description: "Is the image being used or in a room",
  })
  inUse: boolean;
}
