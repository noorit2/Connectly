import { CommunityWithCount } from "./CommunityWithCount";

export interface GetCommunitiesResponse {
    communities: CommunityWithCount[];
    totalPages: number;
    totalCount: number;
}
