export class CreateCommentDto {
  content: string;
  recipeId: number;
}

export class UpdateCommentDto {
  content?: string;
  isApproved?: boolean;
}