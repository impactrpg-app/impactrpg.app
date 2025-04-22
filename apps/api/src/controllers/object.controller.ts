import {
  Controller,
  Get,
  Header,
  InternalServerErrorException,
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

@Controller()
export class ObjectController {
  constructor(private readonly storageService: StorageService) {}

  @ApiOperation({ summary: "Upload a gltf object" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: { type: "string", format: "binary" },
      },
    },
  })
  @ApiOkResponse({ type: ImageUploadResponse })
  @Post("object")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: {
        fileSize: 1024 * 1024 * 50, // 50MB
      },
    })
  )
  @UseGuards(AuthGuard)
  async uploadObject(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest
  ): Promise<ImageUploadResponse> {
    try {
      const uuid = `${uuidv4()}.glb`;
      await this.storageService.put(file.buffer, `${req.user.id}/${uuid}`);
      return { path: `${req.user.id}/${uuid}` };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException("Failed to upload glft object");
    }
  }

  @ApiOperation({ summary: "Get a  gltf object" })
  @Get("object/:path")
  @Header("Content-Type", "model/gltf-binary")
  async getObject(@Param("path") path: string, @Res() res: Response) {
    res.setHeader("Content-Type", "model/gltf-binary");
    res.shouldKeepAlive = true;
    try {
      const response = await this.storageService.get(decodeURIComponent(path));
      res.setHeader("Content-Length", response.ContentLength);
      res.setHeader("Cache-Control", "public, max-age=31536000");
      const data = await response.Body.transformToByteArray();
      res.write(data);
    } catch (e) {
      console.error(e);
    } finally {
      res.end();
    }
  }
}
