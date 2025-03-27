import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from 'src/songs/song.entity';
import { User } from 'src/users/user.entity';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    @InjectRepository(Song)
    private songRepository: Repository<Song>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * Creates a new comment on a song.
   *
   * @param {number} userId - The ID of the user creating the comment.
   * @param {number} songId - The ID of the song being commented on.
   * @param {string} content - The content of the comment.
   * @returns {Promise<Comment>} - The created comment.
   * @throws {NotFoundException} If the user or song is not found.
   */
  public async createComment(
    userId: number,
    songId: number,
    content: string,
  ): Promise<Comment> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const song = await this.songRepository.findOne({
      where: { id: songId },
    });

    if (!user || !song) {
      throw new NotFoundException('User or Track not found');
    }

    const comment = new Comment();
    comment.content = content;
    comment.user = user;
    comment.song = song;
    comment.createdAt = new Date();

    return this.commentRepository.save(comment);
  }

  /**
   * Retrieves all comments for a specific song.
   *
   * @param {number} songId - The ID of the song.
   * @returns {Promise<Comment[]>} - A list of comments sorted by creation date.
   */
  public async getSongComments(songId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { song: { id: songId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Deletes a comment if the user is the owner.
   *
   * @param {number} userId - The ID of the user attempting to delete the comment.
   * @param {number} commentId - The ID of the comment to be deleted.
   * @returns {Promise<Comment>} - The deleted comment.
   * @throws {NotFoundException} - If the comment does not exist or the user is not the owner.
   */
  public async deleteComment(
    userId: number,
    commentId: number,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId, user: { id: userId } },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found or unauthorized');
    }

    return this.commentRepository.remove(comment);
  }
}
