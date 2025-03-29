import {
  DeleteObjectCommand,
  DeleteObjectCommandOutput,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { config } from "../config";
import { Room } from "src/db/room";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CronExpression } from "@nestjs/schedule";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class StorageService {
  private s3Client: S3Client;

  constructor(
    @InjectModel(Room.name)
    private readonly roomModel: Model<Room>
  ) {
    const endpoint = `${config.storage.region}.${config.storage.host}`;
    this.s3Client = new S3Client({
      endpoint: `https://${endpoint}`,
      region: config.storage.region,
      credentials: {
        accessKeyId: config.storage.key,
        secretAccessKey: config.storage.secret,
        accountId: "digitalocean",
      },
    });
  }

  async put(image: Buffer, key: string) {
    const command = new PutObjectCommand({
      Bucket: config.storage.bucket,
      Key: key,
      Body: image,
      ACL: "public-read",
      ContentType: "image/webp",
    });
    const result = await this.s3Client.send(command);
    return result;
  }

  async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: config.storage.bucket,
      Key: key,
    });
    const result = await this.s3Client.send(command);
    return result;
  }

  async get(key: string) {
    const command = new GetObjectCommand({
      Bucket: config.storage.bucket,
      Key: key,
    });
    const result = await this.s3Client.send(command);
    return result;
  }

  async list(prefix: string) {
    const command = new ListObjectsV2Command({
      Bucket: config.storage.bucket,
      Prefix: prefix,
    });
    const result = await this.s3Client.send(command);
    return result;
  }

  // @Cron(CronExpression.EVERY_10_MINUTES)
  // async cleanUpTask() {
  //   // get a list of all files in the bucket
  //   const files = await this.list("");
  //   if (!files?.Contents) return;
  //   const imagePaths = files.Contents.map((file) => [
  //     file.Key,
  //     `https://${config.storage.bucket}.${config.storage.region}.${config.storage.host}/image/${file.Key}`,
  //   ]);
  //   const imageUrls = [...imagePaths.values()];

  //   // filter only the images not in use
  //   const result = await this.roomModel.aggregate([
  //     {
  //       $match: {
  //         "objects.image": {
  //           $in: imageUrls,
  //         },
  //       },
  //     },
  //     {
  //       $unwind: "$objects",
  //     },
  //     {
  //       $match: {
  //         "objects.image": {
  //           $in: imageUrls,
  //         },
  //       },
  //     },
  //     {
  //       $addFields: {
  //         path: "$objects.image",
  //       },
  //     },
  //     {
  //       $project: {
  //         path: 1,
  //       },
  //     },
  //   ]);
  //   const imagesInUse = result.map((item) => item.path);
  //   const deletingImages: Promise<DeleteObjectCommandOutput>[] = [];
  //   for (const [path, url] of imagePaths) {
  //     if (imagesInUse.includes(url)) continue;
  //     deletingImages.push(this.delete(path));
  //   }
  //   await Promise.all(deletingImages);
  // }
}
