import {
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  Matches,
  ArrayMinSize,
  IsIn,
} from 'class-validator';
import { Region } from '../../../domain';

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(Region)
  region?: Region;

  @IsOptional()
  @IsString()
  stationId?: string;

  @IsOptional()
  @IsString()
  routeId?: string;

  @IsOptional()
  @IsNumber()
  staOrder?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  leadTimeMinutes?: number;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsIn(['push', 'email'], { each: true })
  channels?: ('push' | 'email')[];

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'activeTimeStart must be in HH:mm format',
  })
  activeTimeStart?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'activeTimeEnd must be in HH:mm format',
  })
  activeTimeEnd?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  activeDays?: number[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
