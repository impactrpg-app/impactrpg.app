import { ApiProperty, IsString } from "../nestjs-imports";

export class ImageUploadResponse {
  @ApiProperty({
    description: "The path of the uploaded image",
  })
  @IsString()
  path: string;
}