import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { Error } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { QueryFailedError } from 'typeorm';

type TAppErrorResponse = {
  statusCode: number;
  response: string | object;
  timestamp: string;
};

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorResponse: TAppErrorResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      response: 'Something Unexpected happened. Please Try Again.',
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof HttpException) {
      errorResponse.statusCode = exception.getStatus();
      errorResponse.response = exception.getResponse();
    }

    if (exception instanceof Error.ValidationError) {
      errorResponse.statusCode = HttpStatus.UNPROCESSABLE_ENTITY;
      errorResponse.response =
        exception.message || 'Validation failed, try again.';
    }

    if (exception instanceof Error.DocumentNotFoundError) {
      errorResponse.statusCode = HttpStatus.NOT_FOUND;
      errorResponse.response = exception.message;
    }

    if (exception instanceof TokenExpiredError) {
      errorResponse.statusCode = HttpStatus.UNAUTHORIZED;
      errorResponse.response = 'Token expired, please log in again.';
    }

    if (exception instanceof JsonWebTokenError) {
      errorResponse.statusCode = HttpStatus.UNAUTHORIZED;
      errorResponse.response =
        'Invalid token expired, please provide a valid token.';
    }
    if (
      exception instanceof QueryFailedError &&
      exception.message.includes('duplicate key value')
    ) {
      errorResponse.statusCode = HttpStatus.CONFLICT;
      errorResponse.response =
        'Duplicate key error: A record with this value already exists.';
    }

    if (
      exception instanceof QueryFailedError &&
      exception.message.includes('violates foreign key')
    ) {
      errorResponse.statusCode = HttpStatus.SERVICE_UNAVAILABLE;
      errorResponse.response =
        'Invalid reference. Related entity does not exist';
    }

    if (
      exception instanceof QueryFailedError &&
      exception.message.includes('violates unique constraint')
    ) {
      errorResponse.statusCode = HttpStatus.CONFLICT;
      errorResponse.response =
        'Duplicate key error: A record with this value already exists.';
    }

    if (
      exception instanceof QueryFailedError &&
      exception.message.includes('null value in column')
    ) {
      errorResponse.statusCode = HttpStatus.SERVICE_UNAVAILABLE;
      errorResponse.response = 'A required field is required';
    }
    response.status(errorResponse.statusCode).json(errorResponse);

    super.catch(exception, host);
  }
}
