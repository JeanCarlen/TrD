import { Controller, Get, Req, Post, UploadedFile, UseInterceptors, ParseFilePipe, FileTypeValidator, UseGuards, Request } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid';
import * as mime from 'mime-types'
import { AuthGuard } from './auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', {
	storage: diskStorage({
		destination: process.env.UPLOADS_PATH,
		filename: function (req, file, cb) {
			const uuid = uuidv4();
			const ext = mime.extension(file.mimetype)
			cb(null, `${uuid}.${ext}`)
		}
	})
  }))
  @Post('file')
  uploadFile(
	@UploadedFile(
		new ParseFilePipe({
		validators: [
			new FileTypeValidator({fileType: /(jpg|jpeg|png)$/}),
		],
	})) file: Express.Multer.File,
	@Req() req
	) {
		// file.filename contains the name of the saved file
		// use Request.user to access the user id from the validated auth token
		// Request.user was set in the authGuard if the token is valid

		return (this.appService.updateUserImage(req.user.id, file.filename));
  }
}
