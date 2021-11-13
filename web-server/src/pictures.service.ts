import { promises as fs } from 'fs';
import { join } from 'path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PicturesService {
  async getPicturesRecursively(dir) {
    const dirFiles = await fs.readdir(dir);
    const files = await Promise.all(
      dirFiles.map(async (file) => {
        const filePath = join(dir, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) return this.getPicturesRecursively(filePath);
        else if (stats.isFile()) return filePath;
      }),
    );

    return files.reduce(
      (all, folderContents) => all.concat(folderContents),
      [],
    );
  }
}
