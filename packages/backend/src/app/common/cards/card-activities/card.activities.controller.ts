import {
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Query,
    Request,
    UseGuards,
} from "@nestjs/common";
import { CardActivitiesService } from "./card.activities.service";
import { CreateCardActivityDto } from "./dto/create.card.activity.dto";
import { JwtAuthGuard } from "../../auth/guards/jwt.auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("cards")
@UseGuards(JwtAuthGuard)
@Controller({
    path: "/cards/:cardId/activities",
    version: "1",
})
export class CardActivitiesController {
    private readonly logger = new Logger("CardActivitiesController");

    constructor(
        private readonly cardActivitiesService: CardActivitiesService
    ) {}

    @Get()
    findAll(
        @Param("cardId") cardId: number,
        @Query("sortBy") sortBy: string,
        @Query("sortOrder") sortOrder: "asc" | "desc"
    ) {
        return this.cardActivitiesService.findAll({
            cardId,
            sortBy: {
                key: sortBy,
                order: sortOrder,
            },
        });
    }

    @Post()
    create(
        @Param("cardId") cardId: number,
        @Body() createActivityDto: CreateCardActivityDto,
        @Request() req
    ) {
        createActivityDto.card = cardId;
        createActivityDto.createdBy = req.user;
        return this.cardActivitiesService.create(createActivityDto);
    }

    @Delete(":id")
    delete(@Param("id") id: number) {
        return this.cardActivitiesService.remove(id);
    }
}
