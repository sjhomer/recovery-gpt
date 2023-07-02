import Image from 'next/image'
import OpenAiArchiveLayout from "../ui/OpenAiArchiveLayout"
import fs from 'fs';
import path from 'path';

async function fetchFiles() {
  const archiveFolderPath = path.join(process.cwd(), 'archive');
  const files = fs.readdirSync(archiveFolderPath);
  return files;
}

export default async function Home() {
  const files = await fetchFiles();

  async function loadFile(file: string) {
    'use server'

    return fs.readFileSync(path.join(process.cwd(), 'archive', file), 'utf8');
  }

  return (
    <main>
      <OpenAiArchiveLayout files={files} loadFile={loadFile} />
    </main>
  )
}
