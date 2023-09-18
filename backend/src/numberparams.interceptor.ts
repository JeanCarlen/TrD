import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'

@Injectable()
export class NumberParamsInterceptor implements NestInterceptor {

	public intercept(context: ExecutionContext, call$: CallHandler): Observable<unknown> {
		const req: Request = context.switchToHttp().getRequest();
		const { method, url, body, headers, params } = req;

		return call$.handle().pipe(
			tap(() => console.log(params))
		)
	}
}