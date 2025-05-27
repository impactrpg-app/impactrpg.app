import { Controller, Get } from "@nestjs/common";
import { version } from "@impact/client/package.json";
import { ApiOperation } from "@nestjs/swagger";

@Controller()
export class GeneralController {
  constructor() {}

  @Get("/health")
  @ApiOperation({ summary: "Health check" })
  healthCheck(): string {
    return "OK";
  }

  @Get("/version")
  @ApiOperation({ summary: "Get version" })
  getVersion(): { version: string } {
    return { version };
  }
}
