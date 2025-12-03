import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, TreeRepository} from 'typeorm';
import {Comments} from './comments.entity';
import {Users} from '../users/users.entity';
import {CreateCommentDto} from './dto/create-comment.dto';
import {UpdateCommentDto} from "./dto/update-comment.dto";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepo: TreeRepository<Comments>,

    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async create(dto: CreateCommentDto) {
    const user = await this.usersRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const comment = this.commentsRepo.create({
      text: dto.text,
      user,
    });

    if (dto.parentId) {
      const parent = await this.commentsRepo.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) throw new NotFoundException('Parent comment not found');

      comment.parent = parent;
    }

    return this.commentsRepo.save(comment);
  }

  async findTree() {
    return this.commentsRepo.findTrees();
  }

  async findOneTree(id: number) {
    const root = await this.commentsRepo.findOne({ where: { id } });
    if (!root) throw new NotFoundException('Comment not found');

    return this.commentsRepo.findDescendantsTree(root);
  }

  async update(id: number, dto: UpdateCommentDto) {
    const comment = await this.commentsRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    Object.assign(comment, dto);
    return this.commentsRepo.save(comment);
  }

  async delete(id: number) {
    const comment = await this.commentsRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');

    return this.commentsRepo.remove(comment);
  }

  async getComments(
    sortBy: 'username' | 'email' | 'comment_created' = 'comment_created',
    order: 'ASC' | 'DESC' = 'DESC', // по умолчанию LIFO
  ) {
    // 1. Получаем все корневые комментарии с пользователями
    const roots = await this.commentsRepo.findRoots({ relations: ['user'] });

    // 2. Сортируем корневые комментарии по запросу пользователя
    const sortedRoots = roots.sort((a, b) => {
      let valA: any, valB: any;

      switch (sortBy) {
        case 'username':
          valA = a.user?.username ?? '';
          valB = b.user?.username ?? '';
          break;

        case 'email':
          valA = a.user?.email ?? '';
          valB = b.user?.email ?? '';
          break;

        case 'comment_created':
        default:
          valA = a.created_at;
          valB = b.created_at;
          break;
      }

      if (valA > valB) return order === 'ASC' ? 1 : -1;
      if (valA < valB) return order === 'ASC' ? -1 : 1;
      return 0;
    });

    // 3. Для каждого корня подгружаем дерево с детьми
    return await Promise.all(
      sortedRoots.map(async root => {
        const tree = await this.commentsRepo.findDescendantsTree(root);

        // 4. Рекурсивно сортируем детей по created_at DESC (LIFO)
        const sortChildrenLIFO = (nodes: Comments[]) => {
          nodes.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
          nodes.forEach(n => n.children && sortChildrenLIFO(n.children));
        };

        if (tree.children) sortChildrenLIFO(tree.children);
        return tree;
      }),
    );
  }


}
