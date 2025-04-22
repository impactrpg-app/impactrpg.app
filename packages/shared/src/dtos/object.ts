import { ApiProperty, IsString } from "../nestjs-imports";

export class ObjectUploadResponse {
  @ApiProperty({
    description: "The path of the uploaded object",
  })
  @IsString()
  path: string;
}
