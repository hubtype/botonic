import decompress from 'decompress'
import download from 'download'
import { existsSync, mkdirSync, readdirSync, rmSync, unlinkSync } from 'fs'
import { platform, tmpdir } from 'os'
import { join } from 'path'
import { extract } from 'tar'

import { getCleanVersionForPackage, getHomeDirectory } from './system-utils'

export class PulumiDownloader {
  private PULUMI_SDK_URL = 'https://get.pulumi.com/releases/sdk'
  // private pulumiDownloadPath = join(getHomeDirectory(), '.botonic')
  // private PULUMI_BINARY_PATH = join(this.PULUMI_DOWNLOAD_PATH, 'pulumi')

  private pulumiDownloadPath: string
  private pulumiBinaryPath: string

  constructor(downloadPath?: string) {
    this.pulumiDownloadPath =
      downloadPath || join(getHomeDirectory(), '.botonic')
    this.pulumiBinaryPath = join(this.pulumiDownloadPath, 'pulumi')
  }

  private isBinaryInstalled(): boolean {
    return existsSync(this.pulumiBinaryPath)
  }

  private async downloadBinaries(version: string): Promise<void> {
    const devPlatform = platform()

    if (!existsSync(this.pulumiDownloadPath)) {
      mkdirSync(this.pulumiDownloadPath)
    }
    if (devPlatform === 'darwin') {
      await this.setupDarwin(version, this.pulumiDownloadPath)
    } else if (devPlatform === 'linux') {
      await this.setupLinux(version, this.pulumiDownloadPath)
    } else if (devPlatform === 'win32') {
      await this.setupWindows(version, this.pulumiDownloadPath)
    } else {
      throw Error(
        `Cannot download Pulumi binaries - platform "${devPlatform}" not supported. Supported ones are "darwin", "linux", and "win32"`
      )
    }
  }
  private async setupDarwin(
    version: string,
    downloadFolder: string
  ): Promise<void> {
    const filename = `pulumi-v${version}-darwin-x64.tar.gz`
    const downloadUrl = `${this.PULUMI_SDK_URL}/${filename}`
    await download(downloadUrl, downloadFolder)
    await extract({
      cwd: downloadFolder,
      file: join(downloadFolder, filename),
    })
    unlinkSync(join(downloadFolder, filename))
  }

  private async setupWindows(
    version: string,
    downloadFolder: string
  ): Promise<void> {
    const filename = `pulumi-v${version}-windows-x64.zip`
    const downloadUrl = `${this.PULUMI_SDK_URL}/${filename}`
    await download(downloadUrl, downloadFolder)
    const archive = join(downloadFolder, filename)
    const destination = join(downloadFolder, 'pulumi')
    await decompress(archive, destination, { strip: 2 })
    unlinkSync(join(downloadFolder, filename))
  }

  private async setupLinux(
    version: string,
    downloadFolder: string
  ): Promise<void> {
    const filename = `pulumi-v${version}-linux-x64.tar.gz`
    const downloadUrl = `${this.PULUMI_SDK_URL}/${filename}`
    await download(downloadUrl, downloadFolder)
    await extract({
      cwd: downloadFolder,
      file: join(downloadFolder, filename),
    })
    unlinkSync(join(downloadFolder, filename))
    console.log('FINISHED download')
  }

  async downloadBinaryIfNotInstalled(
    version = '3.11.0' // getCleanVersionForPackage('@pulumi/pulumi')
  ): Promise<void> {
    if (!this.isBinaryInstalled()) {
      console.log('It seems that it is the first time using Botonic 1.0')
      console.log(`Downloading Pulumi ${version}...`)
      if (!version) {
        throw new Error('Cannot retrieve Pulumi version to download')
      }
      await this.downloadBinaries(version)
      console.log('Pulumi downloaded.')
    } else {
      console.log('Detected Pulumi in your machine.')
    }
    return
  }

  getBinaryPath(): string {
    return this.pulumiBinaryPath
  }

  getBinary(): string {
    return join(this.pulumiBinaryPath, 'pulumi')
  }
}
