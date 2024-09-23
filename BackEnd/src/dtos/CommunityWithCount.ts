import { Community } from "../types/community";

export interface CommunityWithCount extends Community {
    member_count: number;
}
