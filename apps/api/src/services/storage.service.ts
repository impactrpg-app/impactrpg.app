import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { Injectable } from "@nestjs/common";
import { config } from "../config";

@Injectable()
export class StorageService {
  private s3Client: S3Client;

  constructor() {
    const endpoint = `${config.storage.region}.${config.storage.host}`;
    this.s3Client = new S3Client({
      endpoint: `https://${endpoint}`,
      region: config.storage.region,
      credentials: {
        accessKeyId: config.storage.key,
        secretAccessKey: config.storage.secret,
        accountId: "digitalocean",
      },
    })
  }

  async put(image: Buffer, key: string) {;      
    const command = new PutObjectCommand({
      Bucket: config.storage.bucket,
      Key: key,
      Body: image,
      ACL: "public-read",
      ContentType: "image/webp"
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
}
