import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';

export class UpdateDocumentDto extends PartialType(
  OmitType(CreateDocumentDto, ['file'] as const)
) {}