import {
  Controller,
  Delete,
  Get,
  Header,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiOkResponse } from "@nestjs/swagger";
import { ApiConsumes } from "@nestjs/swagger";
import { ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import { StorageService } from "src/services/storage.service";
import { AuthRequest } from "src/middleware/auth.guard";
import { AuthGuard } from "src/middleware/auth.guard";
import { v4 as uuidv4 } from "uuid";
import { ImageUploadResponse } from "@impact/shared";
import Sharp from "sharp";

@Controller()
export class ImageController {
  constructor(private readonly storageService: StorageService) {}

  @ApiOperation({ summary: "Upload an image" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        image: { type: "string", format: "binary" },
      },
    },
  })
  @ApiOkResponse({ type: ImageUploadResponse })
  @Post("image")
  @UseInterceptors(
    FileInterceptor("image", {
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    })
  )
  @UseGuards(AuthGuard)
  async uploadImage(
    @UploadedFile() image: Express.Multer.File,
    @Req() req: AuthRequest
  ): Promise<ImageUploadResponse> {
    try {
      // convert to webp
      const webpBuffer = await Sharp(image.buffer)
        .webp({ quality: 80 })
        .toBuffer();

      const uuid = uuidv4();
      await this.storageService.put(webpBuffer, `${req.user.id}/${uuid}`);
      return { path: `${req.user.id}/${uuid}` };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to upload image");
    }
  }

  @ApiOperation({ summary: "Get an image" })
  @Get("image/:imagePath")
  @Header("Content-Type", "image/webp")
  async getImage(
    @Req() req: AuthRequest,
    @Param("imagePath") imagePath: string,
    @Res() res: Response
  ) {
    res.shouldKeepAlive = true;
    try {
      const response = await this.storageService.get(
        decodeURIComponent(imagePath)
      );
      res.setHeader("Content-Type", "image/webp");
      res.setHeader("Content-Length", response.ContentLength);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      const data = await response.Body.transformToByteArray();
      res.write(data);
      res.end();
    } catch (e) {
      throw new NotFoundException();
    }
  }

  @ApiOperation({ summary: "Delete an image" })
  @Delete("image/:uuid")
  @UseGuards(AuthGuard)
  async deleteImage(@Req() req: AuthRequest, @Param("uuid") uuid: string) {
    await this.storageService.delete(`${req.user.id}/${uuid}`);
  }
}
