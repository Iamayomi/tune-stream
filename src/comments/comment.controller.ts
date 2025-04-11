import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

import { Message, GuardRoute } from 'src/library/decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/library/types';
import { RoleAllowed } from 'src/library/decorator/role-allowed';

@ApiBearerAuth('JWT-auth')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * Creates a comment on a song.
   * @route {POST} /api/v1/comment/:songId
   * @access public
   * @param {number} songId - The ID of the song to comment on.
   * @param {string} content - The comment content.
   * @param {Request} req - The request object containing the authenticated user.
   * @returns {Promise<Comment>} - The created comment.
   */

  @Message('User commented successfully')
  @ApiOperation({ summary: 'Add a comment to a song' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 404, description: 'User or Song not found' })
  @ApiParam({
    name: 'songId',
    type: 'number',
    description: 'The ID of the song',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', description: 'The comment content' },
      },
      required: ['content'],
    },
  })
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Post(':songId')
  @Message('user comment succesfully')
  public async createComment(
    @Param('songId') songId: number,
    @Body('content') content: string,
    @Req() req,
  ): Promise<Comment> {
    return this.commentService.createComment(req.user.id, songId, content);
  }

  /**
   * Retrieves all comments for a specific song.
   * @route {GET} /api/v1/comment/:songId
   * @access public
   * @param {number} songId - The ID of the song.
   * @returns {Promise<Comment[]>} - A list of comments for the song.
   */

  @ApiOperation({ summary: 'Get all comments for a song' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved comments' })
  @ApiResponse({ status: 404, description: 'Song not found' })
  @ApiParam({
    name: 'songId',
    type: 'number',
    description: 'The ID of the song',
  })
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Get(':songId')
  public async getSongComments(
    @Param('songId') songId: number,
  ): Promise<Comment[]> {
    return this.commentService.getSongComments(songId);
  }

  /**
   * Deletes a comment if the user is the owner.
   * @route {GET} /api/v1/comment/:songId
   * @access public
   * @param {number} commentId - The ID of the comment to delete.
   * @param {Request} req - The request object containing the authenticated user.
   * @returns {Promise<Comment>} - The deleted comment.
   */

  @ApiOperation({ summary: 'Delete a comment (only if the user is the owner)' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({
    status: 404,
    description: 'Comment not found or unauthorized',
  })
  @ApiParam({
    name: 'commentId',
    type: 'number',
    description: 'The ID of the comment to delete',
  })
  @RoleAllowed(Roles.USER)
  @GuardRoute()
  @Delete(':commentId')
  public async deleteComment(
    @Param('commentId') commentId: number,
    @Req() req,
  ): Promise<Comment> {
    return this.commentService.deleteComment(req.user.id, commentId);
  }
}
